/**
 * Crea e restituisce una versione "debounced" della funzione fornita.
 * Una funzione debounced ritarda l'invocazione della funzione originale
 * fino a dopo che sono passati 'delay' millisecondi dall'ultima volta
 * che la funzione debounced è stata invocata.
 * 
 * @param {Function} func - La funzione da debounciare.
 * @param {number} delay - Il numero di millisecondi da aspettare prima dell'invocazione di 'func'.
 * @returns {Function} Una nuova funzione che ritarda l'invocazione di 'func' di 'delay' millisecondi.
 */
export function debounce(func, delay) {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}