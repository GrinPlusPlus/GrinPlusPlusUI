import React from "react";
import ButtonAppNav from '../ButtonAppNav';
import SendModal from '../../components/Modals/SendModal';
import TransactionsList from '../../components/TransactionsList'

export default () => (
    <React.Fragment>
        <ButtonAppNav />
        <h1> Transactions page! </h1>
        <SendModal />
        <TransactionsList />
    </React.Fragment>
)
