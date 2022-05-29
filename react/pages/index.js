import CalcConfigs from '../components/calc_configs.jsx';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios'
import { LinearProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import ResultTable from '../components/result_table.jsx';
import Figure from '../components/figure.jsx';


function ResponsiveDrawer(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [query, set_query] = React.useState({})
  const [timeOutId, setTimeOutId] = React.useState()
  const [data, set_data] = React.useState()
  const [loading, set_loading] = React.useState()
  const [image_url, set_image_url] = React.useState()



  function update() {
    let bodyFormData = new FormData();
    Object.entries(query).forEach(([key, value]) => {
      bodyFormData.append(key, value)
      console.log("post req", key, value, bodyFormData)
    })



    axios({
      method: "post",
      url: process.env.NEXT_PUBLIC_PY_SERVER + "/calc_dim",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        set_data(response.data)
        console.log(response);
        set_loading(false)
        
      })
      .catch(function (response) {
        //handle error
        enqueueSnackbar('Falha ao calcular', {
          variant: 'error',
          persist: true,
          preventDuplicate: true,
        });
        console.log(response);
        set_loading(false)
      });
  }

  React.useEffect(() => {
    set_loading(true)
    if (timeOutId) clearTimeout(timeOutId)
    setTimeOutId(setTimeout(() => update(), 1000))
    console.log("change")
  }, [query])

  let drawerWidth = (typeof window !== "undefined") ? Math.max(Math.min(window?.innerWidth * 0.75, 320), 250) : 320

  const container =
    (typeof window !== "undefined") ? () => window.document.body : undefined;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <SettingsIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Calculadora de eixo
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          <CalcConfigs callback={set_query} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          <CalcConfigs callback={set_query} />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {(loading) ? <LinearProgress /> : null}
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: "column" }}>
          <ResultTable sx={{ mt: 3}} rows={[
            { name: 'Distancia d', value: data?.d, unidade: 'm' },
            { name: "Diametro do eixo", value: data?.dim_eixo, unidade: 'm' },
            { name: "Força 1", value: data?.f1, unidade: 'N' },
            { name: "Força 2", value: data?.f2, unidade: 'N' },
            { name: "Momento Fletor maximo", value: data?.momento_fletor_max, unidade: 'N.m' },
            { name: "Momento torçor", value: data?.momento_torcor, unidade: 'N.m' },
            { name: "Reação 1", value: data?.r1, unidade: 'N' },
            { name: "Reação 2", value: data?.r2, unidade: 'N' },
            { name: "Comprimento do eixo", value: data?.shaft_len, unidade: 'm' },
          ]} />
          <Box
            component="img"
            sx={{
              px: 10,
              maxWidth: { md: '60vw' }
            }}
            alt="Diagrama"
            src={image_url}
          />
          <Figure data={data} url={process.env.NEXT_PUBLIC_PY_SERVER + "/shaft_plot"}></Figure>
          <Figure data={data} url={process.env.NEXT_PUBLIC_PY_SERVER + "/cortante_plot"}></Figure>


        </Box>
      </Box>
    </Box>
  );
}


export default ResponsiveDrawer;
