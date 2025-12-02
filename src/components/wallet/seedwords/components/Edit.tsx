import { useFormContext } from 'react-hook-form';
import { EditWrapper } from './edit.styles.ts';
import SeedWordInput from './SeedWordInput.tsx';

const SEEDWORD_REGEX = /^(([a-zA-Z]+)\s){23}([a-zA-Z]+)$/;

export const Edit = () => {
    const { register } = useFormContext<{ seedWords: string }>();

    // Register the hidden field for form validation
    register('seedWords', {
        required: true,
        pattern: {
            value: SEEDWORD_REGEX,
            message: 'Enter 24 words separated by spaces',
        },
    });

    return (
        <EditWrapper>
            <SeedWordInput />
        </EditWrapper>
    );
};
