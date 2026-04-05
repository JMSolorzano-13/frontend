import {createAsyncThunk} from '@reduxjs/toolkit'
import {fetchTotals} from '@api/cfdi'
import {ADD_CFDI_Types} from '@constants/Enums'
import {
  domainBuilderForDates,
  efosDomainBuilder,
  formatDatesWithOperators,
} from '@utils/domains'
import {RootState} from '../store'

type Out = {
  module: CFDIModule
  totals: CFDIsTotals | null
  validationId?: string
}

type In = {
  module: CFDIModule
  options?: SearchOptions & {
    overridePeriodDates?: boolean
  }
  validationId?: string
  cfdiTypes: ADD_CFDI_Types[]
}

export const getCanceledCanNotBeSend = createAsyncThunk<
  Out,
  In,
  {rejectValue: string; state: RootState}
>(
  'add/getCanceledCanNotBeSend',
  async (
    {options, module, validationId, cfdiTypes},
    {rejectWithValue, getState}
  ) => {
    const {company, rfc} = getState().auth
    if (!company || !rfc) {
      console.error('Error in getAvailableEzaudita: no company or rfc selected')
      return rejectWithValue('Sin compañía o RFC')
    }
    const {periodDates, efosPeriodDates} = getState().common
    let types = cfdiTypes
    if (cfdiTypes.length === 0) {
      types = [
        ADD_CFDI_Types.INGRESS,
        ADD_CFDI_Types.EGRESS,
        ADD_CFDI_Types.PAYMENT,
        ADD_CFDI_Types.PAYROLL,
        ADD_CFDI_Types.TRANSFER,
      ]
    }

    const domain: Domain = []

    if (options) {
      options.domain = formatDatesWithOperators(options.domain ?? [])
    }

    if (
      module === 'efos' &&
      efosPeriodDates &&
      !efosPeriodDates?.startsWith('Todos') &&
      !options?.overridePeriodDates
    ) {
      const efosDomain = efosDomainBuilder(efosPeriodDates)
      domain.push(...efosDomain)
    }

    if (
      module !== 'efos' &&
      periodDates &&
      !periodDates?.startsWith('Todos') &&
      !options?.overridePeriodDates
    ) {
      const dateDomains = domainBuilderForDates(periodDates)
      domain.push(...dateDomains)
    }

    try {
      if (rfc) {
        // Set module filter
        switch (module) {
          case 'issued':
            domain.push(['is_issued', '=', true])
            break

          case 'received':
            domain.push(['is_issued', '=', false])
            break

          default:
            break
        }
      }

      let cfdiTotals: CFDIsTotals | null = null

      const availableRules: Domain = [
        ['Estatus', '=', false],
        ['from_xml', '=', false],
        ['add_exists', '=', false],
      ]

      domain.push(...availableRules)
      if (!types.find((item) => item.includes('ALL'))) {
        domain.push(['TipoDeComprobante', 'in', types as string[]])
      }
      cfdiTotals = await (
        await fetchTotals(company, {
          domain: [...domain, ...(options?.domain || [])],
          search: options?.search,
        })
      ).totals

      return {
        module,
        totals: cfdiTotals,
        validationId,
      }
    } catch (e: any) {
      console.error('Unexpected error in getAvailableEzaudita: ', e)
      return rejectWithValue('Error al obtener los totales CFDIs')
    }
  }
)
