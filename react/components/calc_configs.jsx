import Slider from '@mui/material/Slider';
import { useEffect, useState, useReducer } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputSliderWText from './Input_slider_text';



const inputs = [
  {
    value: 1,
    name: 'shaft_len',
    title: 'Comprimento do eixo (m)',
    min: 1,
    max: 100,
    step: 0.1,
    type: 'number'
  },
  {
    value: 0.2,
    name: 'd',
    title: 'd',
    min: 0.1,
    max: 100,
    step: 0.1,
    type: 'number'
  },
  {
    value: 1,
    name: 'torque',
    title: 'Torque',
    min: 1,
    max: 100,
    step: 0.1,
    type: 'number'
  },
  {
    value: 1,
    name: 'coeficiente_seguranca',
    title: 'Coeficiente de segurança',
    min: 1,
    max: 100,
    step: 0.1,
    type: 'number'
  },
  {
    value: 1,
    name: 'peso_conjunto',
    title: 'Peso do conjunto (kg)',
    min: 1,
    max: 100,
    step: 0.1,
    type: 'number'
  },
  {
    value: 1,
    name: 'coef_transmissao',
    title: 'Coeficiente de transmissão',
    min: 1,
    max: 100,
    step: 0.1,
    type: 'number'
  },
  {
    value: 0.8,
    name: 'corr_acabamento_superficial',
    title: 'corr_acabamento_superficial',
    min: 0,
    max: 10,
    step: 0.1,
    type: 'number',
    optional: true
  },
  {
    value: 0.9,
    name: 'corr_tam_peca',
    title: 'corr_tam_peca',
    min: 0,
    max: 10,
    step: 0.1,
    type: 'number',
    optional: true
  },
  {
    value: 0.897,
    name: 'fator_confiabilidade',
    title: 'fator_confiabilidade',
    min: 0,
    max: 10,
    step: 0.1,
    type: 'number',
    optional: true
  },
  {
    value: 1.0,
    name: 'temp_corr',
    title: 'temp_corr',
    min: 0,
    max: 10,
    step: 0.1,
    type: 'number',
    optional: true
  },
  {
    value: 1.0,
    name: 'servicos_pesados',
    title: 'servicos_pesados',
    min: 0,
    max: 10,
    step: 0.1,
    type: 'number',
    optional: true
  },
  {
    value: 0.63,
    name: 'corr_tensao_concentrados',
    title: 'corr_tensao_concentrados',
    min: 0,
    max: 10,
    step: 0.1,
    type: 'number',
    optional: true
  },
  {
    value: 1.8e8,
    name: 'lim_resist_fadiga',
    title: 'lim_resist_fadiga',
    min: 0,
    max: 10,
    step: 0.1,
    type: 'number',
    optional: true
  },
]

const initialState = inputs.reduce((o, input) => Object.assign(o, { [input.name]: input }), {});


export default function CalcConfigs(props) {
  const [optional_entries, set_optional_entries] = useState(false);


  function reducer(state, action) {
    let tmpObj = { ...state }
    console.debug('query update', { state, action })

    tmpObj[action.key].value = action.value
    if (tmpObj.shaft_len.value / 2 - 0.1 < tmpObj.d.value) tmpObj.d.value = (tmpObj.shaft_len.value / 2 - 0.1);
    const values = Object.entries(tmpObj).reduce((o, [, input]) => Object.assign(o, { [input.name]: input.value }), {});

    tmpObj.d_entre_rodas = {
      name: 'd_entre_rodas',
      value: tmpObj.shaft_len.value - 2 * tmpObj.d.value
    }

    tmpObj.d.max = tmpObj.shaft_len.value / 2 - 0.1
    tmpObj.d.step = (tmpObj.d.max > 10) ? 1 : 0.1


    console.log('query update', { state, tmpObj, action, values })
    try {
      props.callback({ ...values, optional_entries: optional_entries ? 1 : 0 })
    } catch {
      console.error("error on query update", error)
    }

    return tmpObj
  }

  const [state, dispatch] = useReducer(reducer, initialState);


  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexDirection: 'column',
        my: 3,
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" sx={{ mb: 3 }} align="center" noWrap component="div">
        Configurações
      </Typography>

      <Box sx={{
        display: 'flex',
        gap: 2,
        flexDirection: 'column',

        alignItems: 'center',
        width: '100%',

        ml: 1,
        pr: 4,
      }}>
        {
          inputs.map((input) => {
            if (input.optional) return null
            return <InputSliderWText
              value={state[input.name].value}
              onChange={(value) => dispatch({ key: input.name, value })}
              key={input.name}
              label={input.title}
              step={state[input.name].step}
              min={input.min}
              max={state[input.name].max}
            />
          })
        }


      </Box>
      <Accordion sx={{ m: 0, p: 0 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Opções avançadas</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mr: 4 }}>
          <FormControlLabel
            control={
              <Switch
                checked={optional_entries}
                onClick={(e) => set_optional_entries(e.target.checked)}
                defaultChecked
              />
            }
            sx={{ mb: 3 }}
            label="Personalizar as configurações"
            labelPlacement="end"
          />



          {
            inputs.map((input) => {
              if (!input.optional) return null
              return <InputSliderWText
                value={state[input.name].value}
                onChange={(value) => dispatch({ key: input.name, value })}
                key={input.name}
                label={input.title}
                step={state[input.name].step}
                min={input.min}
                max={state[input.name].max}
              />
            })
          }

        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
