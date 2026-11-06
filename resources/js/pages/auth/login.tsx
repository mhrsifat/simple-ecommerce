import { Form, Head, router } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';

type Props = {
    status?: string;
};

export default function Login({ status }: Props) {
    const [demoLoading, setDemoLoading] = useState(false);

    const handleDemoLogin = () => {
        setDemoLoading(true);

        router.post(
            '/login',
            {
                email: 'admin@admin.com',
                password: 'password',
                remember: true,
            },
            {
                onError: () => {
                    router.post(
                        '/login',
                        {
                            email: 'admin@banglapuzzle.com',
                            password: 'password',
                            remember: true,
                        },
                        {
                            onFinish: () => setDemoLoading(false),
                        },
                    );
                },
                onFinish: () => setDemoLoading(false),
            },
        );
    };

    return (
        <>
            <Head title="Admin Login" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Admin Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                autoComplete="email"
                                placeholder="admin@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autoComplete="current-password"
                                placeholder="Password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 w-full"
                            disabled={processing || demoLoading}
                        >
                            {processing && <Spinner />}
                            Log in
                        </Button>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-emerald-600">
                    {status}
                </div>
            )}

            <div className="mt-6 rounded-lg border border-dashed p-4">
                <div className="mb-3">
                    <p className="text-sm font-semibold">Demo Admin Access</p>
                    <p className="text-xs text-muted-foreground">
                        Quick access for evaluators.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    disabled={demoLoading}
                    onClick={handleDemoLogin}
                >
                    {demoLoading ? (
                        <Spinner />
                    ) : (
                        <ShieldCheck className="h-4 w-4" />
                    )}
                    Login as Admin
                </Button>
            </div>
        </>
    );
}

Login.layout = {
    title: 'Admin Login',
    description: 'Log in to the administration panel',
};
