use anchor_lang::{error_code};

#[error_code]
pub enum ErrorCode {
    #[msg("Program already initialized")]
    AlreadyInitiated,
    #[msg("Title cannot be greater than 64 characters")]
    TitleTooLong,
    #[msg("Description cannot be greater than 512 characters")]
    DescriptionTooLong,
    #[msg("Img Url cannot be greater than 512 characters")]
    IMGUrlTooLong,
    #[msg("Title cannot be Empty")]
    TitleEmpty,
    #[msg("Invalid goal amount")]
    InvalidGoalAmount,
    #[msg("Person is unauthorized")]
    UnAuthorized,
    #[msg("Campaign is not active")]
    NotActiveCampaign,
    #[msg("Campaign goal acheived")]
    CampaignGoalAcheived,
    #[msg("Invalid Donation amount min 1 sol")]
    InvalidDonationAmount,
    #[msg("Unauthorized to withdraw from this campaign")]
    UnAuthorizedTransaction,
    #[msg("Insufficient funds to withdraw")]
    InsufficientFunds,
    #[msg("Invalid platform address")]
    InvalidPlatformAddress
}