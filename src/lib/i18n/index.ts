import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'fr';

register('fr', () => import('$lib/lang/fr.json'));
register('en', () => import('$lib/lang/en.json'))

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale
});