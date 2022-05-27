import CalcConfigs from '../components/calc_configs.js';
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

  function update() {
    let bodyFormData = new FormData();
    Object.entries(query).forEach(([key, value]) => {
      bodyFormData.append(key, value)
      console.log("post req", key,value,bodyFormData)
    })
  
    axios({
      method: "post",
      url: "https://hbeserra-nextjs-resistencia-dos-materiais-95p5jr94hpg5r-5000.githubpreview.dev/calc_dim",
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
    if(timeOutId) clearTimeout(timeOutId)
    setTimeOutId(setTimeout(()=> update(),1000))
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
            Calculadora de eixo {drawerWidth}
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
          <CalcConfigs  callback={set_query} />
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
        {(loading)?<LinearProgress  />: null}
        <Box sx={{ display: 'flex', alignContent: 'center', flexDirection: "column"}}>
          <typography variant="subtitle1"> Variaveis</typography> 
          <typography> Distancia da roda a mola: {parseFloat(data?.d).toFixed(3)}</typography>
          <typography> Diametro do eixo: {parseFloat(data?.dim_eixo).toFixed(3)}</typography>
          <typography> Força 1: {parseFloat(data?.f1).toFixed(3)}</typography>
          <typography> Força 2: {parseFloat(data?.f2).toFixed(3)}</typography>
          <typography> Momento Fletor maximo: {parseFloat(data?.momento_fletor_max).toFixed(3)}</typography>
          <typography> Momento torçor: {parseFloat(data?.momento_torcor).toFixed(3)}</typography>
          <typography> Reação 1: {parseFloat(data?.r1).toFixed(3)}</typography>
          <typography> Reação 2: {parseFloat(data?.r2).toFixed(3)}</typography>
          <typography> Comprimento do eixo: {parseFloat(data?.shaft_len).toFixed(3)}</typography>
        </Box>
      </Box>
    </Box>
  );
}


export default ResponsiveDrawer;
