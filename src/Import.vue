<template>
    <Errors :errors="errors" />
    <div style="display: flex; gap: 1em">
        <div class="instructions">
            <h1>Resultaten importeren uit magister</h1>
            <ol>
                <li>Ga naar je magister cijfers</li>
                <li>Klik op "Bekijk cijferoverzicht"</li>
                <li>
                    Onder <strong>Cijfersoort</strong> bij
                    <strong>Weergave</strong> selecteer
                    <strong>PTA - kolommen</strong>
                </li>
                <li>
                    Selecteer alles op de pagina met de toetsencombinatie
                    <kbd>Ctrl</kbd>+<kbd>a</kbd> (<span class="kbdcb"
                        ><kbd>⌘ Command</kbd>+<kbd>a</kbd></span
                    >
                    voor Apple producten)
                </li>
                <li>
                    Kopieer het geselecteerde naar je klipbord met de
                    toetsencombinatie <kbd>Ctrl</kbd>+<kbd>c</kbd>
                </li>
                <li>Ga terug naar deze pagina</li>
                <li>
                    Laad je resultaten door ze te plakken op deze pagina met
                    <kbd>Ctrl</kbd>+<kbd>v</kbd>
                </li>
                <li><a href="./">Ga terug</a> naar de hoofdpagina</li>
            </ol>
        </div>
        <img
            src="./demo.gif"
            class="demo"
            alt="Voorbeeld van het importeren van magister cijfers"
        />
        <table class="magister_results">
            <tr :key="result.magister" v-for="result in imported_results">
                <td>{{ result.magister }}</td>
                <td>{{ result.score }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
import Errors from './components/Errors.vue';
import { load, save, parsePaste } from './utils.js';

export default {
    name: 'Import',
    components: {
        Errors,
    },
    data() {
        return {
            imported_results: [],
            errors: [],
        };
    },
    mounted() {
        document.querySelector('body').addEventListener('paste', (e) => {
            try {
                const results = parsePaste(
                    e.clipboardData.getData('text/html')
                );
                this.imported_results = results;
            } catch (err) {
                console.error(err);
                this.errors.push(err);
                return;
            }
        });
    },
    watch: {
        imported_results() {
            let results = { ...load('results', {}) };
            for (const result of this.imported_results) {
                results[result.assignment.id] = result.score;
            }
            save('results', results);
            // TODO: Also turn on apropiate optional subjects
        },
    },
};
</script>

<style>
body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: min(2vw, 2em);
    margin: 1em;
}

.instructions {
    flex: 1;
    line-height: 1.6;
}

.demo {
    width: 20em;
    height: auto;
}

h1 {
    font-size: 1.2em;
}

kbd {
    background-color: #eee;
    border-radius: 0.1em;
    border: 1px solid #b4b4b4;
    color: #333;
    font-size: 0.85em;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
}

.magister_results {
    border-collapse: collapse;
}

td {
    border: 0.06em solid blue;
}
</style>
