<template>
  <v-menu offset-y>
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        variant="text"
        prepend-icon="mdi-translate"
        class="language-switcher mr-2"
      >
        {{ currentLanguageName }}
      </v-btn>
    </template>
    
    <v-list>
      <v-list-item
        v-for="(name, code) in availableLocales"
        :key="code"
        @click="changeLanguage(code)"
        :active="currentLocale === code"
      >
        <v-list-item-title>{{ name }}</v-list-item-title>
        <template v-slot:prepend>
          <v-icon v-if="currentLocale === code" icon="mdi-check" />
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, getAvailableLocales, type LocaleKey } from '../../plugins/i18n.plugin'

const { locale } = useI18n()

const availableLocales = getAvailableLocales()
const currentLocale = computed(() => locale.value as LocaleKey)
const currentLanguageName = computed(() => availableLocales[currentLocale.value])

async function changeLanguage(langCode: LocaleKey) {
  try {
    await setLocale(langCode)
  } catch (error) {
    console.error('Failed to change language:', error)
  }
}
</script>

<style scoped>
.language-switcher {
  min-width: 120px;
}
</style> 