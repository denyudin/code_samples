import React from 'react'
import { FormattedMessage } from 'react-intl'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { connect } from 'react-redux'
import { currencyEURFormatter } from 'components/Form/formatters'
import { formulaStatusFormatter } from 'components/Payments/PaymentFormulasTable'
import * as formulasActions from 'actions/payments/formulasActions'
import SearchSubTitle from './SearchSubtitle'
import { Link } from 'react-router-dom'
import { sanitizeFilters } from 'services/payments/paymentsService'

interface Payment {
  payment: {
    name: string
  }
  package: {
    name: string
  }
  fee?: number
  status?: string
}

interface IOwnProps {
  data: Payment[]
  user: {
    firstname?: string,
    lastname?: string
  }
}

type Props = ReturnType<typeof mapDispatchToProps> & IOwnProps

const generateFormulaLink = (paymentPackage, data, getPayment) => {
  const paymentId = data.payment.id

  return (
    <Link to={`/payments/${paymentId}?tab=members`}
      onClick={() => {
        getPayment(paymentId, paymentPackage)
      }}
      className='btn btn-default qwerty-search-btn'
    >
      <FormattedMessage id='n.btn.manage.payment' defaultMessage='Manage payment' />
    </Link >
  )
}

const PaymentsSearchResults: React.FC<Props> = (props) => {
  const { data = [], getPayment } = props

  if (data.length === 0) {
    return null
  }

  return (
    <div>
      <SearchSubTitle
        id='payment.search.payments.title'
        defaultMessage='Payments'
      />
      <BootstrapTable
        striped
        data={data}
        version='4'>
        <TableHeaderColumn isKey dataField='id' hidden />
        <TableHeaderColumn dataField='payment' dataFormat={(payment) => payment.name}><FormattedMessage id='payment.search.payments.title' defaultMessage='Payment' /></TableHeaderColumn>
        <TableHeaderColumn dataField='package' dataFormat={(formula) => formula && formula.name}><FormattedMessage id='formula.field.package' defaultMessage='Package' /></TableHeaderColumn>
        <TableHeaderColumn dataField='fee' dataAlign='right' dataFormat={(fee) => !isNaN(fee) ? currencyEURFormatter(fee) : ''}><FormattedMessage id='formula.field.fee' defaultMessage='Fee' /></TableHeaderColumn>
        <TableHeaderColumn dataField='status' dataFormat={formulaStatusFormatter}><FormattedMessage id='formula.field.status' defaultMessage='Status' /></TableHeaderColumn>
        <TableHeaderColumn dataField='package' dataAlign='center' dataFormat={(paymentPackage, rowData) => generateFormulaLink(paymentPackage, rowData, getPayment)}></TableHeaderColumn>
      </BootstrapTable>
    </div>
  )
}

const mapDispatchToProps = (dispatch, ownProps: IOwnProps) => {
  return {
    getPayment: (paymentId, paymentPackage) => {
      const { firstname, lastname } = ownProps.user
      const packageId = paymentPackage && paymentPackage.id

      dispatch(formulasActions.filterFormulas({
        paymentId,
        filters: sanitizeFilters({
          package: packageId,
          firstname,
          lastname
        })
      }))
    }
  }
}

export default connect(null, mapDispatchToProps)(PaymentsSearchResults)
