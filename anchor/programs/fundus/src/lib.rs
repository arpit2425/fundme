use anchor_lang::prelude::*;
mod constants;
mod errors;
mod instructions;
mod states;
use instructions::*;
#[allow(unused_imports)]
use states::*;

// Program ID declaration (replace with your own ID when deploying)
declare_id!("D1orwWBhT5KxkAouQs5YjWyY6Dvv5LDzrazCWuP68bWq");

#[program]
pub mod fundus {
    use super::*;
    pub fn initialize(ctx: Context<InitializeCtx>)-> Result<()>{
        instructions::initialize(ctx)
    }
    pub fn create_campaign(ctx:Context<CampaignCtx>,title:String,description:String,img_url:String,goal:u64)->Result<()>{
        instructions::create_campaign(ctx, title, description, img_url, goal)
    }   
    pub fn update_campaign(ctx:Context<UpdateCampaignCtx>,cid:u64,title:String,description:String,img_url:String,goal:u64)->Result<()>{
        instructions::update_campaign(ctx,cid, title, description, img_url, goal)
    }   
    pub fn delete_campaign(ctx:Context<DeleteCampaignCtx>,cid:u64)->Result<()>{
        instructions::delete_campaign(ctx,cid)
    }  
    pub fn donate(ctx:Context<Donate>,cid:u64,amount:u64)->Result<()>{
        instructions::donate(ctx, cid, amount)
    }
    pub fn withdraw(ctx:Context<WithdrawCtx>,cid:u64,amount:u64)->Result<()>{
        instructions::withdraw(ctx, cid, amount)
    }
    pub fn update_platform_settings(ctx:Context<UpdatePlatformSettingsCtx>,platform_fee:u64)->Result<()>{
        instructions::update_platform_settings(ctx, platform_fee)
    }
}

