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

    
   
}

