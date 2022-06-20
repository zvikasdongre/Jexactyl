import tw from 'twin.macro';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import useFlash from '@/plugins/useFlash';
import stripe from '@/api/store/gateways/stripe';
import Select from '@/components/elements/Select';
import { Button } from '@/components/elements/button/index';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';

export default () => {
    const { clearAndAddHttpError } = useFlash();
    const [ amount, setAmount ] = useState(0);
    const [ submitting, setSubmitting ] = useState(false);

    const submit = () => {
        setSubmitting(true);

        stripe(amount).then(url => {
            setSubmitting(false);

            // @ts-ignore
            window.location.href = url;
        }).catch(error => {
            console.error(error);
            clearAndAddHttpError({ key: 'store:stripe', error });
            setSubmitting(false);
        });
    };

    return (
        <TitledGreyBox title={'Purchase via Stripe'}>
            <FlashMessageRender byKey={'store:stripe'} css={tw`mb-2`} />
            <Formik
                onSubmit={submit}
                initialValues={{
                    amount: 100,
                }}
            >
                <Form>
                    <SpinnerOverlay size={'large'} visible={submitting} />
                    <Select
                        name={'amount'}
                        disabled={submitting}
                        // @ts-ignore
                        onChange={e => setAmount(e.target.value)}
                    >
                        <option key={'stripe:placeholder'} hidden>Choose an amount...</option>
                        <option key={'stripe:buy:100'} value={100}>Purchase 100 credits</option>
                        <option key={'stripe:buy:200'} value={200}>Purchase 200 credits</option>
                        <option key={'stripe:buy:500'} value={500}>Purchase 500 credits</option>
                        <option key={'stripe:buy:1000'} value={1000}>Purchase 1000 credits</option>
                    </Select>
                    <div css={tw`mt-6`}>
                        <Button type={'submit'} disabled={submitting}>
                            Purchase via Stripe
                        </Button>
                    </div>
                </Form>
            </Formik>
        </TitledGreyBox>
    );
};
