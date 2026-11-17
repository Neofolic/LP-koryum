import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { AO, AR, BR, CL, CO, DE, ES, FR, GB, IT, MX, MZ, PT, PY, US, UY } from 'country-flag-icons/react/3x2';

// País, bandeira e código. O Brasil vem primeiro.
export const PAISES = [
  { iso: 'BR', nome: 'Brasil', ddi: '55', Flag: BR },
  { iso: 'PT', nome: 'Portugal', ddi: '351', Flag: PT },
  { iso: 'US', nome: 'Estados Unidos', ddi: '1', Flag: US },
  { iso: 'AR', nome: 'Argentina', ddi: '54', Flag: AR },
  { iso: 'PY', nome: 'Paraguai', ddi: '595', Flag: PY },
  { iso: 'UY', nome: 'Uruguai', ddi: '598', Flag: UY },
  { iso: 'CL', nome: 'Chile', ddi: '56', Flag: CL },
  { iso: 'CO', nome: 'Colômbia', ddi: '57', Flag: CO },
  { iso: 'MX', nome: 'México', ddi: '52', Flag: MX },
  { iso: 'ES', nome: 'Espanha', ddi: '34', Flag: ES },
  { iso: 'IT', nome: 'Itália', ddi: '39', Flag: IT },
  { iso: 'GB', nome: 'Reino Unido', ddi: '44', Flag: GB },
  { iso: 'DE', nome: 'Alemanha', ddi: '49', Flag: DE },
  { iso: 'FR', nome: 'França', ddi: '33', Flag: FR },
  { iso: 'AO', nome: 'Angola', ddi: '244', Flag: AO },
  { iso: 'MZ', nome: 'Moçambique', ddi: '258', Flag: MZ },
];

const semAcento = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Seletor do código do país, com busca. Teclado: setas, Enter para escolher e Esc para fechar
// (o Esc fecha só a lista, não o formulário).
export default function DdiSelect({ valor, aoMudar, aoEscolher }) {
  const id = useId();
  const raiz = useRef(null);
  const botao = useRef(null);
  const busca = useRef(null);
  const lista = useRef(null);
  const [aberto, setAberto] = useState(false);
  const [termo, setTermo] = useState('');
  const [ativo, setAtivo] = useState(0);

  const atual = PAISES.find((p) => p.ddi === valor) ?? PAISES[0];
  const filtrados = useMemo(() => {
    const t = semAcento(termo.trim().replace(/^\+/, ''));
    if (!t) return PAISES;
    return PAISES.filter((p) => semAcento(p.nome).includes(t) || p.ddi.startsWith(t));
  }, [termo]);

  const abrir = () => {
    setTermo('');
    setAtivo(Math.max(PAISES.findIndex((p) => p.ddi === valor), 0));
    setAberto(true);
  };
  const fechar = (devolverFoco = true) => {
    setAberto(false);
    if (devolverFoco) botao.current?.focus();
  };
  const escolher = (p) => {
    aoMudar(p.ddi);
    setAberto(false);
    aoEscolher?.();
  };

  // foco na busca ao abrir; clique fora fecha
  useEffect(() => {
    if (!aberto) return undefined;
    busca.current?.focus();
    const fora = (e) => {
      if (!raiz.current?.contains(e.target)) setAberto(false);
    };
    document.addEventListener('mousedown', fora);
    return () => document.removeEventListener('mousedown', fora);
  }, [aberto]);

  // mantém o item ativo à vista ao navegar pelo teclado
  useEffect(() => {
    if (!aberto) return;
    lista.current?.querySelector(`[data-i="${ativo}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [ativo, aberto]);

  const teclas = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      fechar();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setAtivo((i) => Math.min(i + 1, filtrados.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setAtivo((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtrados[ativo]) escolher(filtrados[ativo]);
    } else if (e.key === 'Tab') {
      fechar(false);
    }
  };

  return (
    <div className="ddi" ref={raiz}>
      <button
        ref={botao}
        type="button"
        className="ddi__botao"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-label={`Código do país: ${atual.nome} +${atual.ddi}`}
        onClick={() => (aberto ? fechar() : abrir())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !aberto) {
            e.preventDefault();
            abrir();
          }
        }}
      >
        <atual.Flag className="ddi__bandeira" aria-hidden="true" />
        <span>+{atual.ddi}</span>
        <ChevronDown className={`ddi__seta${aberto ? ' ddi__seta--aberta' : ''}`} size={14} strokeWidth={2} aria-hidden="true" />
      </button>

      {aberto && (
        <div className="ddi__menu" onKeyDown={teclas}>
          <label className="ddi__busca">
            <Search size={15} strokeWidth={2} aria-hidden="true" />
            <input
              ref={busca}
              type="text"
              value={termo}
              onChange={(e) => {
                setTermo(e.target.value);
                setAtivo(0);
              }}
              placeholder="Buscar país ou código"
              aria-label="Buscar país ou código"
              aria-controls={`${id}-lista`}
              aria-activedescendant={filtrados[ativo] ? `${id}-${filtrados[ativo].iso}` : undefined}
              autoComplete="off"
            />
          </label>
          <ul ref={lista} id={`${id}-lista`} className="ddi__lista" role="listbox" aria-label="Código do país">
            {filtrados.map((p, i) => (
              <li
                key={p.iso}
                id={`${id}-${p.iso}`}
                data-i={i}
                role="option"
                aria-selected={p.ddi === valor}
                className={`ddi__item${i === ativo ? ' ddi__item--ativo' : ''}`}
                onMouseEnter={() => setAtivo(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => escolher(p)}
              >
                <p.Flag className="ddi__bandeira" aria-hidden="true" />
                <span className="ddi__nome">{p.nome}</span>
                <span className="ddi__codigo">+{p.ddi}</span>
                <Check className="ddi__check" size={15} strokeWidth={2.25} aria-hidden="true" />
              </li>
            ))}
            {!filtrados.length && <li className="ddi__vazio">Nenhum país encontrado</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
