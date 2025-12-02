import styled from 'styled-components';
import * as m from 'motion/react-m';
import { Typography } from '@app/components/elements/Typography.tsx';

export const Wrapper = styled.div`
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    gap: 6px;
`;

export const TopRow = styled.div`
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    gap: 6px;
`;

export const Tooltip = styled.div`
    display: flex;
    position: absolute;
    z-index: 2;
`;

export const ExpandedBox = styled(m.div)`
    display: flex;
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-radius: ${({ theme }) => theme.shape.borderRadius.app};
    border: 1px solid ${({ theme }) => theme.palette.divider};
    box-shadow: 2px 8px 8px 0 rgba(0, 0, 0, 0.3);
    flex-direction: column;
    gap: 6px;
    width: 300px;
    padding: 20px;
    z-index: 10;

    h5,
    strong {
        margin: 0;
        color: ${({ theme }) => theme.palette.text.primary};
    }
`;

export const TooltipChipWrapper = styled.div`
    display: flex;
    padding: 4px 0 0 0;
    flex-direction: row;
    gap: 6px;
`;

export const TooltipChip = styled.div`
    display: flex;
    color: ${({ theme }) => theme.palette.text.primary};
    background-color: ${({ theme }) => theme.palette.background.accent};
    flex-direction: column;
    border-radius: 10px;
    padding: 10px 10px 6px 10px;
    flex-shrink: 1;
    flex-grow: 2;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

export const TooltipChipHeading = styled(Typography).attrs({ variant: 'p' })`
    white-space: nowrap;
    color: ${({ theme }) => theme.palette.text.secondary};
    font-weight: 500;
`;

export const TooltipChipText = styled(Typography).attrs({ variant: 'p' })`
    color: ${({ theme }) => theme.palette.text.primary};
    font-size: 18px;
    font-weight: 500;
    line-height: 1.1;
    height: 27px;
    display: flex;
    align-items: center;
`;

export const PoolConnectionStatus = styled.div<{ $isConnected: boolean }>`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 600;
    background-color: ${({ $isConnected, theme }) =>
        $isConnected ? 'rgba(49, 238, 170, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
    color: ${({ $isConnected }) => ($isConnected ? '#31eeaa' : '#ef4444')};
    border: 1px solid ${({ $isConnected }) => ($isConnected ? 'rgba(49, 238, 170, 0.3)' : 'rgba(239, 68, 68, 0.3)')};

    &::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: ${({ $isConnected }) => ($isConnected ? '#31eeaa' : '#ef4444')};
    }
`;
