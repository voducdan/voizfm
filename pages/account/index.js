// import next
import Head from 'next/head';

import Account from '../../src/components/Account/Account';

function AccountPage() {
    return (
        <div>
            <Head>
                <title>Account</title>
            </Head>
            <Account />
        </div>
    )
}

export default AccountPage