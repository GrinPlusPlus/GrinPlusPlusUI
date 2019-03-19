import React from "react";
import ButtonAppNav from '../ButtonAppNav';
import SendModal from '../../components/Modals/SendModal';
import TransactionsList from '../../components/TransactionsList'
import StatusBar from '../StatusBar'

export default () => (
    <React.Fragment>
        <ButtonAppNav pageName='Transactions'/>
        <h1> Transactions page! </h1>
        <SendModal />
        <TransactionsList />
        <StatusBar/>
    </React.Fragment>
)
