// Copyright 2024. The Tari Project
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
// following disclaimer in the documentation and/or other materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote
// products derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
// USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

use std::sync::LazyLock;
use tokio::sync::{watch, RwLock};

use crate::LOG_TARGET_APP_LOGIC;

#[derive(Clone, Debug, PartialEq)]
pub enum WalletOnboardingChoice {
    Pending,
    CreateNew,
    Import(Vec<String>),
}

pub struct WalletOnboardingChannel {
    sender: watch::Sender<WalletOnboardingChoice>,
    receiver: watch::Receiver<WalletOnboardingChoice>,
}

static INSTANCE: LazyLock<RwLock<WalletOnboardingChannel>> =
    LazyLock::new(|| RwLock::new(WalletOnboardingChannel::new()));

impl WalletOnboardingChannel {
    fn new() -> Self {
        let (sender, receiver) = watch::channel(WalletOnboardingChoice::Pending);
        Self { sender, receiver }
    }

    pub fn current() -> &'static RwLock<WalletOnboardingChannel> {
        &INSTANCE
    }

    pub async fn wait_for_choice(&self) -> WalletOnboardingChoice {
        let mut receiver = self.receiver.clone();
        loop {
            let choice = receiver.borrow().clone();
            if choice != WalletOnboardingChoice::Pending {
                return choice;
            }
            if receiver.changed().await.is_err() {
                log::error!(target: LOG_TARGET_APP_LOGIC, "Wallet onboarding channel closed unexpectedly");
                return WalletOnboardingChoice::CreateNew;
            }
        }
    }

    pub fn set_choice(&self, choice: WalletOnboardingChoice) {
        let _ = self.sender.send(choice);
    }

    pub fn reset(&self) {
        let _ = self.sender.send(WalletOnboardingChoice::Pending);
    }
}

