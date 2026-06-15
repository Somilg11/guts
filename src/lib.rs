use napi_derive::napi;
use napi::bindgen_prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum SchemaRule {
    String { 
        min: Option<usize>, 
        max: Option<usize>, 
        message: Option<String>, 
        coerce: Option<bool>,
        format: Option<String> 
    },
    Number { min: Option<f64>, max: Option<f64>, message: Option<String>, coerce: Option<bool> },
    Boolean { message: Option<String>, coerce: Option<bool> },
    Object { shape: HashMap<String, SchemaRule> },
    Array { items: Box<SchemaRule> },
    Tuple { items: Vec<SchemaRule> },
    Record { values: Box<SchemaRule> },
    Enum { values: Vec<String>, message: Option<String> },
    Literal { value: serde_json::Value, message: Option<String> },
    Optional { inner: Box<SchemaRule> },
    Nullable { inner: Box<SchemaRule> },
    Union { options: Vec<SchemaRule> },
}

fn is_optional(rule: &SchemaRule) -> bool {
    matches!(rule, SchemaRule::Optional { .. })
}

impl SchemaRule {
    fn validate(&self, value: &mut serde_json::Value, path: &mut Vec<String>) -> std::result::Result<(), String> {
        match self {
            SchemaRule::String { min, max, message, coerce, format } => {
                if coerce.unwrap_or(false) && !value.is_string() {
                    let coerced_str = match value {
                        serde_json::Value::Number(n) => n.to_string(),
                        serde_json::Value::Bool(b) => b.to_string(),
                        _ => return Err(format!("Error at [{}]: Transformation to string failed", path.join("."))),
                    };
                    *value = serde_json::Value::String(coerced_str);
                }

                if let Some(s) = value.as_str() {
                    if let Some(m) = min {
                        if s.len() < *m { return Err(format!("Error at [{}]: {}", path.join("."), message.clone().unwrap_or(format!("String too short (Min: {})", m)))); }
                    }
                    if let Some(m) = max {
                        if s.len() > *m { return Err(format!("Error at [{}]: {}", path.join("."), message.clone().unwrap_or(format!("String too long (Max: {})", m)))); }
                    }
                    if let Some(fmt) = format {
                        if fmt == "email" && (!s.contains('@') || !s.contains('.')) {
                            return Err(format!("Error at [{}]: Invalid email format syntax", path.join(".")));
                        }
                        if fmt == "uuid" && (s.len() != 36 || s.chars().filter(|&c| c == '-').count() != 4) {
                            return Err(format!("Error at [{}]: Invalid secure UUID format tokens", path.join(".")));
                        }
                    }
                    Ok(())
                } else {
                    Err(format!("Error at [{}]: {}", path.join("."), message.clone().unwrap_or("Expected string primitive".to_string())))
                }
            }
            SchemaRule::Number { min, max, message, coerce } => {
                if coerce.unwrap_or(false) && !value.is_number() {
                    let coerced_num = match value {
                        serde_json::Value::String(s) => s.parse::<f64>().map_err(|_| format!("Error at [{}]: Cannot coerce string to float", path.join(".")))?,
                        serde_json::Value::Bool(b) => if *b { 1.0 } else { 0.0 },
                        _ => return Err(format!("Error at [{}]: Transformation to number failed", path.join("."))),
                    };
                    if let Some(num) = serde_json::Number::from_f64(coerced_num) {
                        *value = serde_json::Value::Number(num);
                    }
                }

                if let Some(n) = value.as_f64() {
                    if let Some(m) = min {
                        if n < *m { return Err(format!("Error at [{}]: {}", path.join("."), message.clone().unwrap_or(format!("Number too small (Min: {})", m)))); }
                    }
                    if let Some(m) = max {
                        if n > *m { return Err(format!("Error at [{}]: {}", path.join("."), message.clone().unwrap_or(format!("Number too big (Max: {})", m)))); }
                    }
                    Ok(())
                } else {
                    Err(format!("Error at [{}]: {}", path.join("."), message.clone().unwrap_or("Expected number primitive".to_string())))
                }
            }
            SchemaRule::Boolean { message, coerce } => {
                if coerce.unwrap_or(false) && !value.is_boolean() {
                    let coerced_bool = match value {
                        serde_json::Value::String(s) => s.parse::<bool>().unwrap_or(!s.is_empty()),
                        serde_json::Value::Number(n) => n.as_f64().unwrap_or(0.0) != 0.0,
                        _ => false,
                    };
                    *value = serde_json::Value::Bool(coerced_bool);
                }
                if value.is_boolean() { Ok(()) } else {
                    Err(format!("Error at [{}]: {}", path.join("."), message.clone().unwrap_or("Expected boolean primitive".to_string())))
                }
            }
            SchemaRule::Tuple { items } => {
                if let Some(arr) = value.as_array_mut() {
                    if arr.len() != items.len() {
                        return Err(format!("Error at [{}]: Tuple length mismatch. Expected {}, got {}", path.join("."), items.len(), arr.len()));
                    }
                    for (index, (item_rule, val)) in items.iter().zip(arr.iter_mut()).enumerate() {
                        path.push(index.to_string());
                        item_rule.validate(val, path)?;
                        path.pop();
                    }
                    Ok(())
                } else {
                    Err(format!("Error at [{}]: Expected native tuple array", path.join(".")))
                }
            }
            SchemaRule::Record { values } => {
                if let Some(obj) = value.as_object_mut() {
                    for (key, val) in obj.iter_mut() {
                        path.push(key.clone());
                        values.validate(val, path)?;
                        path.pop();
                    }
                    Ok(())
                } else {
                    Err(format!("Error at [{}]: Expected record map object", path.join(".")))
                }
            }
            SchemaRule::Enum { values, message } => {
                if let Some(s) = value.as_str() {
                    if values.contains(&s.to_string()) { Ok(()) } else {
                        Err(format!("Error at [{}]: {}", path.join("."), message.clone().unwrap_or(format!("Invalid enum value. Expected one of {:?}", values))))
                    }
                } else {
                    Err(format!("Error at [{}]: Expected string primitive for enum lookup", path.join(".")))
                }
            }
            SchemaRule::Literal { value: expected_val, message } => {
                if value == expected_val { Ok(()) } else {
                    Err(format!("Error at [{}]: {}", path.join("."), message.clone().unwrap_or(format!("Expected literal match for {}", expected_val))))
                }
            }
            SchemaRule::Optional { inner } | SchemaRule::Nullable { inner } => {
                if value.is_null() { Ok(()) } else { inner.validate(value, path) }
            }
            SchemaRule::Union { options } => {
                let mut failure_traces = Vec::new();
                for option in options {
                    let mut tentative_value = value.clone();
                    match option.validate(&mut tentative_value, path) {
                        Ok(_) => {
                            *value = tentative_value;
                            return Ok(());
                        }
                        Err(trace) => failure_traces.push(trace),
                    }
                }
                Err(format!("Error at [{}]: Value failed union validation gates -> [{}]", path.join("."), failure_traces.join(" | ")))
            }
            SchemaRule::Object { shape } => {
                if let Some(obj) = value.as_object_mut() {
                    for (key, sub_rule) in shape {
                        path.push(key.clone());
                        if let Some(val) = obj.get_mut(key) {
                            sub_rule.validate(val, path)?;
                        } else {
                            if !is_optional(sub_rule) && !path.contains(&"__stream__".to_string()) {
                                return Err(format!("Error at [{}]: Missing required field", path.join(".")));
                            }
                        }
                        path.pop();
                    }
                    Ok(())
                } else {
                    Err(format!("Error at [{}]: Expected structural object", path.join(".")))
                }
            }
            SchemaRule::Array { items } => {
                if let Some(arr) = value.as_array_mut() {
                    for (index, val) in arr.iter_mut().enumerate() {
                        path.push(index.to_string());
                        items.validate(val, path)?;
                        path.pop();
                    }
                    Ok(())
                } else {
                    Err(format!("Error at [{}]: Expected native array", path.join(".")))
                }
            }
        }
    }
}

#[napi]
pub struct GutsValidator {
    rule: SchemaRule,
}

#[napi]
impl GutsValidator {
    #[napi(constructor)]
    pub fn new(schema_json: String) -> Result<Self> {
        let rule: SchemaRule = serde_json::from_str(&schema_json)
            .map_err(|_| Error::new(Status::InvalidArg, "Malformed structural blueprint".to_string()))?;
        Ok(GutsValidator { rule })
    }

    #[napi]
    pub fn parse(&self, mut value: serde_json::Value) -> Result<serde_json::Value> {
        let mut path_context = Vec::new();
        self.rule.validate(&mut value, &mut path_context)
            .map_err(|err_msg| Error::new(Status::GenericFailure, err_msg))?;
        Ok(value)
    }

    #[napi]
    pub fn parse_stream(&self, partial_json: String) -> Result<bool> {
        let mut processed_json = partial_json.trim().to_string();
        if processed_json.is_empty() { return Ok(true); }

        let mut open_brackets = Vec::new();
        let mut in_string = false;
        let mut chars = processed_json.chars().peekable();

        while let Some(c) = chars.next() {
            if c == '"' { in_string = !in_string; continue; }
            if in_string { continue; }
            if c == '{' || c == '[' { open_brackets.push(c); }
            if c == '}' || c == ']' { open_brackets.pop(); }
        }

        if in_string { processed_json.push('"'); }
        while let Some(bracket) = open_brackets.pop() {
            if bracket == '{' { processed_json.push('}'); }
            if bracket == '[' { processed_json.push(']'); }
        }

        if let Ok(mut parsed_val) = serde_json::from_str::<serde_json::Value>(&processed_json) {
            let mut path_context = vec!["__stream__".to_string()];
            if let Err(err_msg) = self.rule.validate(&mut parsed_val, &mut path_context) {
                let clean_err = err_msg.replace("__stream__.", "").replace("__stream__", "");
                return Err(Error::new(Status::GenericFailure, clean_err));
            }
        }
        Ok(true)
    }
}