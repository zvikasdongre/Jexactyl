import tw from 'twin.macro';
import React, { useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { Button } from '@/components/elements/button/index';
import SetupTwoFactorModal from '@/components/dashboard/forms/SetupTwoFactorModal';
import DisableTwoFactorModal from '@/components/dashboard/forms/DisableTwoFactorModal';

export default () => {
    const [ visible, setVisible ] = useState(false);
    const isEnabled = useStoreState((state: ApplicationStore) => state.user.data!.useTotp);

    return (
        <div>
            {visible && (
                isEnabled ?
                    <DisableTwoFactorModal visible={visible} onModalDismissed={() => setVisible(false)}/>
                    :
                    <SetupTwoFactorModal visible={visible} onModalDismissed={() => setVisible(false)}/>
            )}
            <p css={tw`text-sm`}>
                {isEnabled ?
                    'Two-factor authentication is currently enabled on your account.'
                    :
                    'You do not currently have two-factor authentication enabled on your account. Click the button below to begin configuring it.'
                }
            </p>
            <div css={tw`mt-6`}>
                <Button onClick={() => setVisible(true)}>
                    {isEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </Button>
            </div>
        </div>
    );
};
