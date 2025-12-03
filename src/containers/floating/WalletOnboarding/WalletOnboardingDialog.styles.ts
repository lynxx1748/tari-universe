import styled from 'styled-components';
import { Typography } from '@app/components/elements/Typography.tsx';

export const Wrapper = styled.div`
    display: flex;
    width: clamp(500px, 40vw, 600px);
    flex-direction: column;
    padding: 40px;
    gap: 30px;
`;

export const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
`;

export const Title = styled(Typography).attrs({ variant: 'h2' })`
    line-height: 1.2;
`;

export const Subtitle = styled(Typography)`
    color: ${({ theme }) => theme.palette.text.secondary};
    max-width: 400px;
`;

export const OptionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

export const OptionCard = styled.button<{ $selected?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    border-radius: 12px;
    border: 2px solid ${({ theme, $selected }) => ($selected ? theme.palette.primary.main : theme.palette.divider)};
    background: ${({ theme, $selected }) =>
        $selected ? `${theme.palette.primary.main}15` : theme.palette.background.paper};
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    width: 100%;

    &:hover {
        border-color: ${({ theme }) => theme.palette.primary.main};
        background: ${({ theme }) => `${theme.palette.primary.main}10`};
    }
`;

export const OptionTitle = styled(Typography).attrs({ variant: 'h5' })`
    margin-bottom: 4px;
`;

export const OptionDescription = styled(Typography)`
    color: ${({ theme }) => theme.palette.text.secondary};
    font-size: 14px;
`;

export const CTAWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 100%;
`;

export const SeedPhraseContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

export const SeedPhraseInput = styled.textarea`
    width: 100%;
    min-height: 120px;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    background: ${({ theme }) => theme.palette.background.default};
    color: ${({ theme }) => theme.palette.text.primary};
    font-family: monospace;
    font-size: 14px;
    resize: vertical;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.palette.primary.main};
    }

    &::placeholder {
        color: ${({ theme }) => theme.palette.text.secondary};
    }
`;

export const ErrorMessage = styled(Typography)`
    color: ${({ theme }) => theme.palette.error.main};
    font-size: 14px;
`;

export const BackButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: ${({ theme }) => theme.palette.text.secondary};
    cursor: pointer;
    font-size: 14px;
    padding: 8px 0;
    align-self: flex-start;

    &:hover {
        color: ${({ theme }) => theme.palette.text.primary};
    }
`;

export const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: ${({ theme }) => theme.palette.primary.main};
    color: white;
    font-size: 40px;
`;

