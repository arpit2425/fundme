use anchor_lang::{prelude::*, solana_program::native_token::LAMPORTS_PER_SOL};
use crate::{errors::ErrorCode, states::Campaign};
pub fn update_campaign(ctx:Context<UpdateCampaignCtx>,cid:u64,title:String,description:String,img_url:String,goal:u64)->Result<()>{
    let campaign=&mut ctx.accounts.campaign;
    let creater=&ctx.accounts.creater;
    if campaign.creator!=creater.key(){
        return Err(ErrorCode::UnAuthorized.into())
    }
    if campaign.cid!=cid{
        return Err(ErrorCode::UnAuthorized.into())
    }
   
    // if title.len()<0 {
    //     return Err(ErrorCode::TitleEmpty.into())
    // }
    if title.len()>60{
        return Err(ErrorCode::TitleTooLong.into())
    }
    if description.len()>512 {
        return Err(ErrorCode::DescriptionTooLong.into())
    }
    if img_url.len()>512{
        return Err(ErrorCode::IMGUrlTooLong.into())
    }
    if goal<LAMPORTS_PER_SOL {
        return Err(ErrorCode::InvalidGoalAmount.into())
    }
    campaign.title=title;
    campaign.description=description;
    campaign.img_url=img_url;
    campaign.goal=goal;
   
    campaign.active=true;
 
    Ok(())
}
#[derive(Accounts)]
#[instruction(cid:u64)]
pub struct UpdateCampaignCtx<'info>{
    #[account(
     mut,
        seeds=[b"campaign",cid.to_le_bytes().as_ref()],
        bump
    )]
    pub campaign:Account<'info,Campaign>,
    pub creater:Signer<'info>,
    pub system_program:Program<'info,System>

}