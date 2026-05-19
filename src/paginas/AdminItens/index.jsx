import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Container,
	Typography,
	Box,
	Button,
	Grid,
	Alert,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Paper,
	Divider,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import Navbar from '../../componentes/Navbar';
import { useAuth } from '../../contextos/AuthContexto';
import ItemCard from '../../componentes/ItemCard';
import {
	listarItens,
	criarItem,
	atualizarItem,
} from '../../servicos/itemServico';
import {
	listarNecessidadesAbertas,
	criarNecessidade,
	deletarNecessidade,
} from '../../servicos/necessidadeServico';

const CATEGORIAS = ['Alimento', 'Higiene', 'Limpeza', 'Vestuario', 'Outros'];
const PRIORIDADES = [
	{ value: 'baixa', label: 'Baixa' },
	{ value: 'media', label: 'Média' },
	{ value: 'alta', label: 'Alta' },
	{ value: 'suficiente', label: 'Suficiente' },
	{ value: 'bloqueado', label: 'Bloqueado' },
];

const AdminItens = () => {
	const { usuario } = useAuth();
	const navegar = useNavigate();

	const [itens, setItens] = useState([]);
	const [necessidades, setNecessidades] = useState([]);

	const [carregando, setCarregando] = useState(true);
	const [processando, setProcessando] = useState(false);
	const [erro, setErro] = useState('');
	const [sucesso, setSucesso] = useState('');

	// Estados do Modal de Edição / Criação
	const [modalOpen, setModalOpen] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [formData, setFormData] = useState({
		id: null,
		nome_item: '',
		categoria: 'Alimento',
		prioridade_status: 'media',
		quantidade_atual: 0,
	});


	const carregarDados = async () => {
		try {
			const [itensDados, necessidadesDados] = await Promise.all([
				listarItens(),
				listarNecessidadesAbertas(),
			]);
			setItens(itensDados);
			setNecessidades(necessidadesDados);
		} catch (err) {
			setErro('Erro ao carregar os dados.');
      console.error('Erro ao carregar itens ou necessidades:', err);
		} finally {
			setCarregando(false);
		}
	};

	  useEffect(() => {
    // eslint-disable-next-line
    carregarDados();
  }, []);

	if (usuario?.tipo_usuario !== 'admin') {
		return (
			<Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
				<Navbar />
				<Container maxWidth='sm' sx={{ py: 6, textAlign: 'center' }}>
					<Alert severity='error' sx={{ mb: 3 }}>
						Acesso Restrito: Apenas administradores podem gerenciar itens.
					</Alert>
					<Button
						variant='contained'
						onClick={() => navegar('/')}
						sx={{ bgcolor: '#1a3c6e' }}
					>
						Voltar para Início
					</Button>
				</Container>
			</Box>
		);
	}

	// Lógica para dividir os Itens
	const idsNecessidades = necessidades.map((n) => n.id_item);

	const itensNoMural = necessidades.map((n) => ({
		...n.item,
		id: n.item.id || n.id_item, // O item embutido tem id, mas fallback pro id_item da necessidade
		necessidade_id: n.id, // O id da necessidade real, usado para remover do mural
	}));

	const itensForaDoMural = itens.filter((i) => !idsNecessidades.includes(i.id));

	// Ações do Mural
	const handleMoverParaNecessidades = async (item) => {
		setErro('');
		setSucesso('');
		setProcessando(true);
		try {
			await criarNecessidade({ id_item: item.id, observacao: null });
			setSucesso(
				`Item "${item.nome_item}" movido para o Mural de Necessidades!`,
			);
			await carregarDados();
		} catch (err) {
			setErro(err.message || 'Erro ao mover para necessidades.');
		} finally {
			setProcessando(false);
		}
	};

	const handleRemoverDeNecessidades = async (item) => {
		setErro('');
		setSucesso('');
		setProcessando(true);
		try {
			await deletarNecessidade(item.necessidade_id);
			setSucesso(`Item "${item.nome_item}" removido do Mural de Necessidades!`);
			await carregarDados();
		} catch (err) {
			setErro(err.message || 'Erro ao remover de necessidades.');
		} finally {
			setProcessando(false);
		}
	};

	// Funções do Formulário e Modal
	const abrirModalCriar = () => {
		setEditMode(false);
		setFormData({
			id: null,
			nome_item: '',
			categoria: 'Alimento',
			prioridade_status: 'media',
			quantidade_atual: 0,
		});
		setModalOpen(true);
	};

	const abrirModalEditar = (item) => {
		setEditMode(true);
		setFormData({
			id: item.id,
			nome_item: item.nome_item,
			categoria: item.categoria,
			prioridade_status: item.prioridade_status,
			quantidade_atual: item.quantidade_atual,
		});
		setModalOpen(true);
	};

	const handleSalvarItem = async (e) => {
		e.preventDefault();
		setErro('');
		setSucesso('');
		setProcessando(true);
		try {
			const payload = {
				nome_item: formData.nome_item,
				categoria: formData.categoria,
				prioridade_status: formData.prioridade_status,
				quantidade_atual: Number(formData.quantidade_atual),
			};

			if (editMode) {
				await atualizarItem(formData.id, payload);
				setSucesso('Item atualizado com sucesso!');
			} else {
				await criarItem(payload);
				setSucesso('Item criado com sucesso!');
			}
			setModalOpen(false);
			await carregarDados();
		} catch (err) {
			setErro(err.message || 'Erro ao salvar item.');
		} finally {
			setProcessando(false);
		}
	};



	return (
		<Box
			sx={{
				minHeight: '100vh',
				backgroundColor: '#f8f9fa',
				pb: { xs: 10, sm: 4 },
			}}
		>
			<Navbar />

			<Container maxWidth='lg' sx={{ py: 4 }}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 4,
						flexWrap: 'wrap',
						gap: 2,
					}}
				>
					<Typography variant='h4' fontWeight={800} color='#1a3c6e'>
						Gestão de Itens do Catálogo
					</Typography>
					<Button
						variant='contained'
						startIcon={<AddIcon />}
						onClick={abrirModalCriar}
						sx={{
							borderRadius: 8,
							textTransform: 'none',
							fontWeight: 'bold',
							bgcolor: '#1a3c6e',
						}}
					>
						Novo Item
					</Button>
				</Box>

				{(erro || sucesso) && (
					<Box sx={{ mb: 3 }}>
						{erro && (
							<Alert severity='error' onClose={() => setErro('')}>
								{erro}
							</Alert>
						)}
						{sucesso && (
							<Alert severity='success' onClose={() => setSucesso('')}>
								{sucesso}
							</Alert>
						)}
					</Box>
				)}

				{carregando ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
						<CircularProgress />
					</Box>
				) : (
					<Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
						{/* Coluna 1: Fora do Mural */}
						<Grid
							item
							xs={12}
							md={6}
							sx={{
								display: 'flex',
								justifyContent: 'center',
								width: '100%',
							}}
						>
							<Paper
								elevation={0}
								sx={{
									p: 3,
									borderRadius: 4,
									height: '100%',
									border: '1px solid #e0e0e0',
									bgcolor: '#fafafa',
									maxWidth: { xs: 500, md: '100%' },
									mx: 'auto',
									width: '100%',
								}}
							>
								<Typography
									variant='h6'
									fontWeight={700}
									color='text.primary'
									gutterBottom
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										gap: 0.5,
									}}
								>
									Catálogo (Fora do Mural)
									<Box
										component='span'
										sx={{
											bgcolor: '#e0e0e0',
											px: 1.5,
											py: 0.5,
											borderRadius: 4,
											fontSize: '0.85rem',
										}}
									>
										{itensForaDoMural.length}
									</Box>
								</Typography>
								<Divider sx={{ mb: 3 }} />

								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
									{itensForaDoMural.length === 0 ? (
										<Typography
											color='text.secondary'
											align='center'
											sx={{ py: 4 }}
										>
											Nenhum item fora do mural.
										</Typography>
									) : (
										itensForaDoMural.map((item) => (
											<ItemCard
												key={item.id}
												item={item}
												isNecessidade={false}
												onEdit={abrirModalEditar}
												onMove={handleMoverParaNecessidades}
											/>
										))
									)}
								</Box>
							</Paper>
						</Grid>

						{/* Coluna 2: No Mural */}
						<Grid
							item
							xs={12}
							md={6}
							sx={{
								display: 'flex',
								justifyContent: 'center',
								width: '100%',
							}}
						>
							<Paper
								elevation={0}
								sx={{
									p: 3,
									borderRadius: 4,
									height: '100%',
									border: '1px solid #ffcc80',
									bgcolor: '#fffde7',
									maxWidth: { xs: 500, md: '100%' },
									mx: 'auto',
									width: '100%',
								}}
							>
								<Typography
									variant='h6'
									fontWeight={700}
									color='#e65100'
									gutterBottom
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										gap: 0.5,
									}}
								>
									No Mural de Necessidades
									<Box
										component='span'
										sx={{
											bgcolor: '#ffe082',
											px: 1.5,
											py: 0.5,
											borderRadius: 4,
											fontSize: '0.85rem',
										}}
									>
										{itensNoMural.length}
									</Box>
								</Typography>
								<Divider sx={{ mb: 3, borderColor: '#ffe082' }} />

								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
									{itensNoMural.length === 0 ? (
										<Typography
											color='text.secondary'
											align='center'
											sx={{ py: 4 }}
										>
											O mural está vazio. Mova itens para cá.
										</Typography>
									) : (
										itensNoMural.map((item) => (
											<ItemCard
												key={item.id}
												item={item}
												isNecessidade={true}
												onEdit={abrirModalEditar}
												onMove={handleRemoverDeNecessidades}
											/>
										))
									)}
								</Box>
							</Paper>
						</Grid>
					</Grid>
				)}
			</Container>

			{/* Modal Criar/Editar */}
			<Dialog
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				maxWidth='xs'
				fullWidth
			>
				<DialogTitle fontWeight={700} color='#1a3c6e'>
					{editMode ? 'Editar Item' : 'Criar Novo Item'}
				</DialogTitle>
				<DialogContent dividers>
					<Box
						component='form'
						id='form-item'
						onSubmit={handleSalvarItem}
						sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
					>
						<TextField
							label='Nome do Item'
							required
							fullWidth
							value={formData.nome_item}
							onChange={(e) =>
								setFormData({ ...formData, nome_item: e.target.value })
							}
						/>

						<FormControl fullWidth required>
							<InputLabel>Categoria</InputLabel>
							<Select
								value={formData.categoria}
								label='Categoria'
								onChange={(e) =>
									setFormData({ ...formData, categoria: e.target.value })
								}
							>
								{CATEGORIAS.map((cat) => (
									<MenuItem key={cat} value={cat}>
										{cat}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl fullWidth required>
							<InputLabel>Prioridade/Status</InputLabel>
							<Select
								value={formData.prioridade_status}
								label='Prioridade/Status'
								onChange={(e) =>
									setFormData({
										...formData,
										prioridade_status: e.target.value,
									})
								}
							>
								{PRIORIDADES.map((prio) => (
									<MenuItem key={prio.value} value={prio.value}>
										{prio.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<TextField
							label='Quantidade no Estoque'
							type='number'
							required
							fullWidth
							inputProps={{ min: 0 }}
							value={formData.quantidade_atual}
							onChange={(e) =>
								setFormData({ ...formData, quantidade_atual: e.target.value })
							}
						/>
					</Box>
				</DialogContent>
				<DialogActions
					sx={{
						p: 2,
						display: 'flex',
						flexDirection: { xs: 'column-reverse', sm: 'row' },
						justifyContent: 'flex-end',
						gap: 1.5,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							gap: 1,
							width: { xs: '100%', sm: 'auto' },
						}}
					>
						<Button
							onClick={() => setModalOpen(false)}
							color='inherit'
							disabled={processando}
							fullWidth
						>
							Cancelar
						</Button>
						<Button
							type='submit'
							form='form-item'
							variant='contained'
							disabled={processando}
							sx={{ bgcolor: '#1a3c6e' }}
							fullWidth
						>
							{processando ? (
								<CircularProgress size={24} color='inherit' />
							) : (
								'Salvar'
							)}
						</Button>
					</Box>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default AdminItens;
