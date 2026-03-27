use anchor_lang::{prelude::*, solana_program::native_token::LAMPORTS_PER_SOL};
use crate::{errors::ErrorCode, states::Campaign};
pub fn delete_campaign(ctx:Context<DeleteCampaignCtx>,cid:u64)->Result<()>{
    let campaign=&mut ctx.accounts.campaign;
    let creater=&ctx.accounts.creater;
    if campaign.creator!=creater.key(){
        return Err(ErrorCode::UnAuthorized.into())
    }
    if campaign.cid!=cid{
        return Err(ErrorCode::UnAuthorized.into())
    }
   if !campaign.active{
    return Err(ErrorCode::NotActiveCampaign.into());
   }
   campaign.active=false;
    Ok(())
}
#[derive(Accounts)]
#[instruction(cid:u64)]
pub struct DeleteCampaignCtx<'info>{
    #[account(
     mut,
        seeds=[b"campaign",cid.to_le_bytes().as_ref()],
        bump
    )]
    pub campaign:Account<'info,Campaign>,
    pub creater:Signer<'info>,
    pub system_program:Program<'info,System>

}