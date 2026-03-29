use anchor_lang::{prelude::*, solana_program::native_token::LAMPORTS_PER_SOL};

use crate::{constants::ANCHOR_DISCRIMINATOR_SIZE, states::{Campaign, ProgramState},errors::ErrorCode};
pub fn create_campaign(ctx:Context<CampaignCtx>,title:String,description:String,img_url:String,goal:u64)->Result<()>{
    let campaign=&mut ctx.accounts.campaign;
    let program_state=&mut ctx.accounts.program_state;
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
    campaign.balance=0;
    campaign.fund_raised=0;
    campaign.donars=0;
    campaign.withdrawals=0;

    campaign.active=true;
    campaign.creator=ctx.accounts.creator.key();
    campaign.cid=program_state.campaign_count;
    program_state.campaign_count+=1;
    campaign.timestamp=Clock::get()?.unix_timestamp as u64;

    Ok(())
}
#[derive(Accounts)]
pub struct CampaignCtx<'info>{
    #[account(
        init,
        space=ANCHOR_DISCRIMINATOR_SIZE+Campaign::INIT_SPACE,
        payer=creator,
        seeds=[b"campaign",program_state.campaign_count.to_le_bytes().as_ref()],
        bump
    )]
    pub campaign:Account<'info,Campaign>,
    #[account(mut)]
    pub program_state:Account<'info,ProgramState>,
    #[account(mut)]
    pub creator:Signer<'info>,
    pub system_program:Program<'info,System>

}