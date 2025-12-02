import { useCallback, useState, useRef, useEffect, ClipboardEvent, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

const WORD_COUNT = 24;

// Common BIP39 words for basic validation (subset for quick validation)
const COMMON_BIP39_PREFIXES = [
    'ab', 'ac', 'ad', 'af', 'ag', 'ai', 'al', 'am', 'an', 'ap', 'ar', 'as', 'at', 'au', 'av', 'aw', 'ax',
    'ba', 'be', 'bi', 'bl', 'bo', 'br', 'bu', 'ca', 'ce', 'ch', 'ci', 'cl', 'co', 'cr', 'cu', 'da', 'de',
    'di', 'do', 'dr', 'du', 'ea', 'ec', 'ed', 'ef', 'eg', 'ei', 'el', 'em', 'en', 'ep', 'eq', 'er', 'es',
    'ev', 'ex', 'ey', 'fa', 'fe', 'fi', 'fl', 'fo', 'fr', 'fu', 'ga', 'ge', 'gi', 'gl', 'go', 'gr', 'gu',
    'ha', 'he', 'hi', 'ho', 'hu', 'ic', 'id', 'ig', 'il', 'im', 'in', 'is', 'it', 'ja', 'je', 'jo', 'ju',
    'ke', 'ki', 'kn', 'la', 'le', 'li', 'lo', 'lu', 'ma', 'me', 'mi', 'mo', 'mu', 'na', 'ne', 'ni', 'no',
    'nu', 'oa', 'ob', 'oc', 'od', 'of', 'ol', 'om', 'on', 'op', 'or', 'ou', 'ov', 'ow', 'ox', 'pa', 'pe',
    'ph', 'pi', 'pl', 'po', 'pr', 'pu', 'qu', 'ra', 're', 'ri', 'ro', 'ru', 'sa', 'sc', 'se', 'sh', 'si',
    'sk', 'sl', 'sm', 'sn', 'so', 'sp', 'sq', 'st', 'su', 'sw', 'sy', 'ta', 'te', 'th', 'ti', 'to', 'tr',
    'tu', 'tw', 'ty', 'ug', 'um', 'un', 'up', 'ur', 'us', 'va', 've', 'vi', 'vo', 'wa', 'we', 'wh', 'wi',
    'wo', 'wr', 'ya', 'ye', 'yo', 'ze', 'zo'
];

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const WordGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    
    @media (max-width: 600px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

const WordInputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const WordNumber = styled.span`
    font-size: 10px;
    color: ${({ theme }) => theme.palette.text.secondary};
    padding-left: 4px;
`;

const WordInput = styled.input<{ $hasError?: boolean; $isValid?: boolean }>`
    width: 100%;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid ${({ theme, $hasError, $isValid }) => 
        $hasError ? theme.palette.error.main : 
        $isValid ? '#31eeaa' : 
        theme.colorsAlpha.darkAlpha[10]};
    background-color: ${({ theme, $isValid }) => 
        $isValid ? 'rgba(49, 238, 170, 0.05)' : theme.palette.background.default};
    font-size: 13px;
    font-family: 'IBM Plex Mono', monospace;
    color: ${({ theme }) => theme.palette.text.primary};
    transition: border-color 0.2s, background-color 0.2s;

    &:focus {
        outline: none;
        border-color: ${({ theme, $hasError }) => 
            $hasError ? theme.palette.error.main : theme.palette.primary.main};
    }

    &::placeholder {
        color: ${({ theme }) => theme.palette.text.secondary};
        opacity: 0.5;
    }
`;

const StatusBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: ${({ theme }) => theme.palette.background.accent};
    border-radius: 8px;
    font-size: 12px;
`;

const WordCount = styled.span<{ $isComplete: boolean }>`
    color: ${({ $isComplete }) => $isComplete ? '#31eeaa' : 'inherit'};
    font-weight: 600;
`;

const HelpText = styled.span`
    color: ${({ theme }) => theme.palette.text.secondary};
    font-size: 11px;
`;

interface SeedWordInputProps {
    onValidChange?: (isValid: boolean, words: string[]) => void;
}

export const SeedWordInput = ({ onValidChange }: SeedWordInputProps) => {
    const { t } = useTranslation('settings', { useSuspense: false });
    const { setValue, trigger } = useFormContext<{ seedWords: string }>();
    const [words, setWords] = useState<string[]>(Array(WORD_COUNT).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const isWordPotentiallyValid = (word: string): boolean => {
        if (!word || word.length < 2) return false;
        const prefix = word.toLowerCase().slice(0, 2);
        return COMMON_BIP39_PREFIXES.includes(prefix);
    };

    const filledCount = words.filter(w => w.trim().length > 0).length;
    const isComplete = filledCount === WORD_COUNT;
    const allWordsValid = words.every(w => !w || isWordPotentiallyValid(w));

    useEffect(() => {
        const seedString = words.join(' ').trim();
        setValue('seedWords', seedString);
        trigger('seedWords');
        
        if (onValidChange) {
            const isValid = isComplete && allWordsValid;
            onValidChange(isValid, words);
        }
    }, [words, setValue, trigger, onValidChange, isComplete, allWordsValid]);

    const handleWordChange = useCallback((index: number, value: string) => {
        const cleanValue = value.toLowerCase().replace(/[^a-z]/g, '');
        setWords(prev => {
            const newWords = [...prev];
            newWords[index] = cleanValue;
            return newWords;
        });
    }, []);

    const handleKeyDown = useCallback((index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Tab') {
            if (e.key === ' ') e.preventDefault();
            if (index < WORD_COUNT - 1 && words[index].trim()) {
                inputRefs.current[index + 1]?.focus();
            }
        } else if (e.key === 'Backspace' && !words[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (index < WORD_COUNT - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    }, [words]);

    const handlePaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text/plain');
        const pastedWords = pastedText
            .trim()
            .toLowerCase()
            .replace(/[,\n\r\t]+/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 0)
            .slice(0, WORD_COUNT);

        if (pastedWords.length > 1) {
            setWords(prev => {
                const newWords = [...prev];
                pastedWords.forEach((word, i) => {
                    if (i < WORD_COUNT) {
                        newWords[i] = word.replace(/[^a-z]/g, '');
                    }
                });
                return newWords;
            });
            // Focus the next empty field or the last field
            const nextEmptyIndex = pastedWords.length < WORD_COUNT ? pastedWords.length : WORD_COUNT - 1;
            setTimeout(() => inputRefs.current[nextEmptyIndex]?.focus(), 0);
        }
    }, []);

    return (
        <Wrapper>
            <StatusBar>
                <WordCount $isComplete={isComplete}>
                    {filledCount} / {WORD_COUNT} {t('seed-words-entered', 'words entered')}
                </WordCount>
                <HelpText>{t('seed-words-help', 'Paste all 24 words or type individually')}</HelpText>
            </StatusBar>
            
            <WordGrid>
                {words.map((word, index) => {
                    const hasContent = word.length > 0;
                    const isValid = hasContent && isWordPotentiallyValid(word);
                    const hasError = hasContent && !isValid;
                    
                    return (
                        <WordInputWrapper key={index}>
                            <WordNumber>{index + 1}.</WordNumber>
                            <WordInput
                                ref={el => { inputRefs.current[index] = el; }}
                                value={word}
                                onChange={e => handleWordChange(index, e.target.value)}
                                onKeyDown={e => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                placeholder={`Word ${index + 1}`}
                                $hasError={hasError}
                                $isValid={isValid}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck={false}
                            />
                        </WordInputWrapper>
                    );
                })}
            </WordGrid>
        </Wrapper>
    );
};

export default SeedWordInput;

