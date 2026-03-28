use anchor_lang::prelude::*;

use crate::states::ProgramState;
use crate::errors::ErrorCode::*;

pub fn update_platform_settings(ctx:Context<UpdatePlatformSettingsCtx>,platform_fee:u64)->Result<()>{
    let program_state=&mut ctx.accounts.program_state;
    let updator=& ctx.accounts.updater;
    if updator.key()!=program_state.platform_address{
        return Err(UnAuthorized.into())
    }
    if !(1..=15).contains(&platform_fee){
        return Err(InvalidPlatformFee.into())
    }
    program_state.platform_fee=platform_fee;
    Ok(())

}
#[derive(Accounts)]
pub struct UpdatePlatformSettingsCtx<'info>{
    #[account(
        seeds= [b"program_state"],
        bump
    )]
        pub program_state:Account<'info,ProgramState>,
        #[account(mut)]
        pub updater:Signer<'info>,
        pub system_program:Program<'info,System>

}