import { useState, useEffect } from 'react';

/**
 * Hook customizado para "debounce" de um valor.
 * Ele atrasa a atualização do valor até que um certo tempo tenha passado sem que o valor original mude.
 * Útil para evitar operações custosas (como buscas em API ou filtragem de listas) a cada pressionar de tecla.
 * @param value O valor a ser "debounced".
 * @param delay O tempo de atraso em milissegundos.
 * @returns O valor "debounced".
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura um timer para atualizar o valor "debounced" após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar (ex: usuário continua digitando)
    // Isso garante que a atualização só ocorra quando o usuário parar de digitar
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Só re-executa o efeito se o valor ou o delay mudarem

  return debouncedValue;
}
