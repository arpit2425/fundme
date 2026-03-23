/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/fundus.json`.
 */
export type Fundus = {
  "address": "D1orwWBhT5KxkAouQs5YjWyY6Dvv5LDzrazCWuP68bWq",
  "metadata": {
    "name": "fundus",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createCampaign",
      "discriminator": [
        111,
        131,
        187,
        98,
        160,
        193,
        114,
        244
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "program_state.campaign_count",
                "account": "programState"
              }
            ]
          }
        },
        {
          "name": "programState"
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "imgUrl",
          "type": "string"
        },
        {
          "name": "goal",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "programState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "deployer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "campaign",
      "discriminator": [
        50,
        40,
        49,
        11,
        157,
        220,
        229,
        192
      ]
    },
    {
      "name": "programState",
      "discriminator": [
        77,
        209,
        137,
        229,
        149,
        67,
        167,
        230
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "alreadyInitiated",
      "msg": "Program already initialized"
    },
    {
      "code": 6001,
      "name": "titleTooLong",
      "msg": "Title cannot be greater than 64 characters"
    },
    {
      "code": 6002,
      "name": "descriptionTooLong",
      "msg": "Description cannot be greater than 512 characters"
    },
    {
      "code": 6003,
      "name": "imgUrlTooLong",
      "msg": "Img Url cannot be greater than 512 characters"
    },
    {
      "code": 6004,
      "name": "titleEmpty",
      "msg": "Title cannot be Empty"
    },
    {
      "code": 6005,
      "name": "invalidGoalAmount",
      "msg": "Invalid goal amount"
    }
  ],
  "types": [
    {
      "name": "campaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cid",
            "type": "u64"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "imgUrl",
            "type": "string"
          },
          {
            "name": "goal",
            "type": "u64"
          },
          {
            "name": "fundRaised",
            "type": "u64"
          },
          {
            "name": "donars",
            "type": "u64"
          },
          {
            "name": "withdrawals",
            "type": "u64"
          },
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "active",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "programState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "campaignCount",
            "type": "u64"
          },
          {
            "name": "platformFee",
            "type": "u64"
          },
          {
            "name": "platformAddress",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
