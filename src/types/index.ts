export interface Empreendimento {
  id: string;
  nome: string;
  endereco: string;
  status: 'Estoque' | 'STAND' | 'PDV';
  foto?: string;
  informacoes: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface EmpreendimentoFormData {
  nome: string;
  endereco: string;
  status: 'Estoque' | 'STAND' | 'PDV';
  foto?: string;
  informacoes: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  creci?: string;
  senha: string;
  foto?: string;
  criadoEm: string;
  atualizadoEm: string;
  aprovado: boolean;
  dataSolicitacao: string;
  aprovadoPor?: string;
  dataAprovacao?: string;
}

export interface UsuarioFormData {
  nome: string;
  email: string;
  telefone: string;
  funcao: string;
  creci?: string;
  senha: string;
  confirmarSenha: string;
}

export interface Contato {
  id: string;
  nome: string;
  telefone: string;
  tipoServico: 'Manutenção' | 'Limpeza' | 'Elétrica' | 'Hidráulica' | 'Pintura' | 'Jardinagem' | 'Segurança' | 'Outros';
  criadoEm: string;
  atualizadoEm: string;
}

export interface ContatoFormData {
  nome: string;
  telefone: string;
  tipoServico: 'Manutenção' | 'Limpeza' | 'Elétrica' | 'Hidráulica' | 'Pintura' | 'Jardinagem' | 'Segurança' | 'Outros';
}

export interface Manutencao {
  id: string;
  empreendimento: string;
  descricao: string;
  status: 'pendente' | 'concluida';
  prioridade: 'baixa' | 'media' | 'alta';
  gerente: string;
  criadoEm: string;
  concluidoEm?: string;
  fotos?: string[];
}

export interface ManutencaoFormData {
  empreendimento: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta';
  gerente: string;
}

export interface Visita {
  id: string;
  corretor: string;
  empreendimento: string;
  data: string;
  horario: string;
  status: 'agendada' | 'realizada' | 'cancelada';
  criadoEm: string;
  observacoes?: string;
}

export interface VisitaFormData {
  corretor: string;
  empreendimento: string;
  data: string;
  horario: string;
  observacoes?: string;
}

export interface AtribuicaoEmpreendimento {
  id: string;
  gerenteId: string;
  gerenteNome: string;
  gerenteEmail: string;
  empreendimentos: {
    id: string;
    nome: string;
    status: 'Estoque' | 'STAND' | 'PDV';
  }[];
}

export interface AtribuicaoFormData {
  gerenteId: string;
  empreendimentoIds: string[];
}