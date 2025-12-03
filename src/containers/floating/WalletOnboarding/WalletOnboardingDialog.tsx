import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { invoke } from '@tauri-apps/api/core';
import { IoWalletOutline, IoKeyOutline, IoArrowBack } from 'react-icons/io5';

import { Dialog, DialogContent } from '@app/components/elements/dialog/Dialog.tsx';
import { Button } from '@app/components/elements/buttons/Button.tsx';
import { useUIStore } from '@app/store/useUIStore.ts';
import { CircularProgress } from '@app/components/elements/CircularProgress.tsx';

import {
    Wrapper,
    Header,
    Title,
    Subtitle,
    OptionsContainer,
    OptionCard,
    OptionTitle,
    OptionDescription,
    CTAWrapper,
    SeedPhraseContainer,
    SeedPhraseInput,
    ErrorMessage,
    BackButton,
    LogoContainer,
} from './WalletOnboardingDialog.styles.ts';

type OnboardingStep = 'choose' | 'import';

export default function WalletOnboardingDialog() {
    const { t } = useTranslation(['wallet-onboarding'], { useSuspense: false });
    const showWalletOnboarding = useUIStore((s) => s.showWalletOnboarding);

    const [step, setStep] = useState<OnboardingStep>('choose');
    const [seedPhrase, setSeedPhrase] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isOpen = showWalletOnboarding;

    const handleCreateWallet = useCallback(async () => {
        setIsLoading(true);
        try {
            await invoke('complete_wallet_onboarding', { createNew: true, seedWords: null });
            useUIStore.setState({ showWalletOnboarding: false });
        } catch (err) {
            console.error('Failed to create wallet:', err);
            setError(t('errors.create-failed'));
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    const handleImportWallet = useCallback(async () => {
        const words = seedPhrase.trim().split(/\s+/);

        if (words.length !== 24) {
            setError(t('errors.invalid-word-count'));
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await invoke('complete_wallet_onboarding', { createNew: false, seedWords: words });
            useUIStore.setState({ showWalletOnboarding: false });
        } catch (err) {
            console.error('Failed to import wallet:', err);
            setError(t('errors.import-failed'));
        } finally {
            setIsLoading(false);
        }
    }, [seedPhrase, t]);

    const handleQuit = useCallback(async () => {
        try {
            await invoke('exit_application');
        } catch (err) {
            console.error('Failed to quit application:', err);
        }
    }, []);

    const renderChooseStep = () => (
        <>
            <Header>
                <LogoContainer>
                    <IoWalletOutline />
                </LogoContainer>
                <Title>{t('title')}</Title>
                <Subtitle>{t('subtitle')}</Subtitle>
            </Header>

            <OptionsContainer>
                <OptionCard onClick={handleCreateWallet} disabled={isLoading}>
                    <OptionTitle>
                        <IoWalletOutline style={{ marginRight: 8, verticalAlign: 'middle' }} />
                        {t('options.create.title')}
                    </OptionTitle>
                    <OptionDescription>{t('options.create.description')}</OptionDescription>
                </OptionCard>

                <OptionCard onClick={() => setStep('import')} disabled={isLoading}>
                    <OptionTitle>
                        <IoKeyOutline style={{ marginRight: 8, verticalAlign: 'middle' }} />
                        {t('options.import.title')}
                    </OptionTitle>
                    <OptionDescription>{t('options.import.description')}</OptionDescription>
                </OptionCard>
            </OptionsContainer>

            <CTAWrapper>
                <Button variant="secondary" size="medium" onClick={handleQuit} disabled={isLoading}>
                    {t('quit')}
                </Button>
            </CTAWrapper>
        </>
    );

    const renderImportStep = () => (
        <>
            <BackButton onClick={() => setStep('choose')} disabled={isLoading}>
                <IoArrowBack />
                {t('back')}
            </BackButton>

            <Header>
                <Title>{t('import.title')}</Title>
                <Subtitle>{t('import.subtitle')}</Subtitle>
            </Header>

            <SeedPhraseContainer>
                <SeedPhraseInput
                    placeholder={t('import.placeholder')}
                    value={seedPhrase}
                    onChange={(e) => {
                        setSeedPhrase(e.target.value);
                        setError('');
                    }}
                    disabled={isLoading}
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </SeedPhraseContainer>

            <CTAWrapper>
                <Button
                    variant="primary"
                    size="large"
                    fluid
                    onClick={handleImportWallet}
                    disabled={isLoading || !seedPhrase.trim()}
                    isLoading={isLoading}
                    loader={<CircularProgress />}
                >
                    {t('import.button')}
                </Button>
                <Button variant="secondary" size="medium" onClick={handleQuit} disabled={isLoading}>
                    {t('quit')}
                </Button>
            </CTAWrapper>
        </>
    );

    return (
        <Dialog open={isOpen}>
            <DialogContent variant="primary">
                <Wrapper>{step === 'choose' ? renderChooseStep() : renderImportStep()}</Wrapper>
            </DialogContent>
        </Dialog>
    );
}

