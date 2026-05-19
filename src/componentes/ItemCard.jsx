import React from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const PRIORIDADE_CORES = {
  baixa: { cor: 'success', label: 'Baixa' },
  media: { cor: 'info', label: 'Média' },
  alta: { cor: 'warning', label: 'Alta' },
  suficiente: { cor: 'default', label: 'Suficiente' },
  bloqueado: { cor: 'error', label: 'Bloqueado' }
};

const ItemCard = ({ item, isNecessidade, onEdit, onMove }) => {
  // item can be either a pure Item object or a Necessidade object containing an Item.
  // In the AdminItens page logic, we will pass the "item" properties explicitly or map them.
  // For simplicity, we assume `item` passed here has:
  // id, nome_item, categoria, prioridade_status, quantidade_atual, and necessidade_id (if it's on the wall)
  
  const prioCfg = PRIORIDADE_CORES[item.prioridade_status] || { cor: 'default', label: item.prioridade_status };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: isNecessidade ? '#ffcc80' : '#e0e0e0',
        bgcolor: isNecessidade ? '#fff8e1' : '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }
      }}
    >
      {/* Header: Name and Priority */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ lineHeight: 1.2 }}>
            {item.nome_item}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: #{item.id} | {item.categoria}
          </Typography>
        </Box>
        <Chip 
          label={`Prioridade: ${prioCfg.label}`} 
          color={prioCfg.cor} 
          size="small" 
          sx={{ fontWeight: 'bold', fontSize: '0.75rem', height: 26, px: 0.5, borderRadius: 2 }} 
        />
      </Box>

      {/* Info: Quantity */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Estoque Atual: <Box component="span" fontWeight="bold" color="text.primary">{item.quantidade_atual}</Box>
        </Typography>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Tooltip title="Editar Item">
            <IconButton onClick={() => onEdit(item)} sx={{ p: 1.2, color: '#1a3c6e', bgcolor: 'rgba(26,60,110,0.08)', '&:hover': { bgcolor: 'rgba(26,60,110,0.15)' } }}>
              <EditIcon />
            </IconButton>
          </Tooltip>

          {isNecessidade ? (
            <Button 
              size="small" 
              onClick={() => onMove(item)} 
              endIcon={<ArrowDownwardIcon fontSize="small" />}
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 'bold', color: '#d32f2f', bgcolor: 'rgba(211,47,47,0.08)', '&:hover': { bgcolor: 'rgba(211,47,47,0.15)' } }}
            >
              Retirar
            </Button>
          ) : (
            <Button 
              size="small" 
              onClick={() => onMove(item)} 
              endIcon={<ArrowUpwardIcon fontSize="small" />}
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 'bold', color: '#2e7d32', bgcolor: 'rgba(46,125,50,0.08)', '&:hover': { bgcolor: 'rgba(46,125,50,0.15)' } }}
            >
              Mural
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ItemCard;
