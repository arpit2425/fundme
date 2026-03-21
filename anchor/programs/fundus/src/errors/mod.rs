use anchor_lang::{error_code};

#[error_code]
pub enum ErrorCode {
    #[msg("Program already initialized")]
    AlreadyInitiated,
    
}