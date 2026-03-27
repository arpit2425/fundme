use anchor_lang::prelude::*;
#[derive(InitSpace)]
#[account]
pub struct Campaign{
    pub cid:u64,
    #[max_len(60)]
    pub title:String,
    pub creator:Pubkey,
    #[max_len(512)]
    pub description:String,
    #[max_len(512)]
    pub img_url:String,
    pub goal:u64,
    pub fund_raised:u64,
    pub donars:u64,
    pub withdrawals:u64,
    pub balance:u64,
    pub timestamp:u64,
    pub active:bool

}