use anchor_lang::{prelude::*, solana_program::{native_token::LAMPORTS_PER_SOL, program, system_instruction}, system_program::Transfer};
use crate::{constants::ANCHOR_DISCRIMINATOR_SIZE, errors::ErrorCode, states::{Campaign, ProgramState, Transaction}};
pub fn withdraw(ctx:Context<WithdrawCtx>,cid:u64,amount:u64)->Result<()>{
    let campaign=&mut ctx.accounts.campaign;
    let transaction=&mut ctx.accounts.transaction;
    let creater=&ctx.accounts.donar;
    let program_state=&mut ctx.accounts.program_state;
    let platform_address=&mut ctx.accounts.platform_address;
   
    if campaign.cid!=cid{
        return Err(ErrorCode::UnAuthorized.into())
    }
    if campaign.creator!=creater.key(){
        return Err(ErrorCode::UnAuthorizedTransaction.into())
    }

    if amount<LAMPORTS_PER_SOL{
        return Err(ErrorCode::InvalidDonationAmount.into());
    }
    if amount>campaign.balance{
        return Err(ErrorCode::InsufficientFunds.into())
    }
    if platform_address.key()!=program_state.platform_address{
        return Err(ErrorCode::InvalidPlatformAddress.into())

    } 
    let rent_amount=Rent::get()?.minimum_balance(campaign.to_account_info().data_len());
   let trx=system_instruction::transfer(&creater.key(), &campaign.key(), amount);
   let result= program::invoke(&trx, &[
        creater.to_account_info(),campaign.to_account_info()
    ]);
    if let Err(e) = result{
        msg!("Donation failed {:?}",e);
        return Err(e.into());
    }
    campaign.balance+=amount;
    campaign.fund_raised+=amount;
    campaign.donars+=1;
    transaction.cid=cid;
    transaction.amount=amount;
    transaction.timestamp=Clock::get()?.unix_timestamp as u64;
    transaction.owner=creater.key();
 
    Ok(())
}
#[derive(Accounts)]
#[instruction(cid:u64)]
pub struct WithdrawCtx<'info>{
    #[account(
     mut,
        seeds=[b"campaign",cid.to_le_bytes().as_ref()],
        bump
    )]
    pub campaign:Account<'info,Campaign>,
    #[account(
        init,
        payer = donar,
        space= ANCHOR_DISCRIMINATOR_SIZE + Transaction::INIT_SPACE,
        seeds= [b"withdraws",donar.key.as_ref(),cid.to_le_bytes().as_ref(),(campaign.withdrawals+1).to_le_bytes().as_ref()],
        bump
    )]
    pub transaction:Account<'info,Transaction>,
    #[account(mut)]
    pub donar:Signer<'info>,
    #[account(mut)]
    pub program_state:Account<'info,ProgramState>,
    ///Check:
    #[account(mut)]
    pub platform_address:AccountInfo<'info>,
    pub system_program:Program<'info,System>

}