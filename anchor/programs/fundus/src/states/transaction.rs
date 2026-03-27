use anchor_lang::prelude::*;
#[derive(InitSpace)]
#[account]
pub struct Transaction{
    pub owner:Pubkey,
    pub amount:u64,
    pub timestamp:u64,
    pub donated:bool, pub cid:u64,

}