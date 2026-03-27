// Тестовая функция для проверки уникальности ответов
import { generatePairs } from './generatePairs'

export const testUniqueAnswers = (iterations: number = 1000) => {
  console.log('🧪 Тестирование уникальности ответов...')
  
  let allPassed = true
  
  for (let i = 0; i < iterations; i++) {
    const pairs = generatePairs(1, 6) // Генерируем 6 пар
    const answers = pairs.map(p => p.answer)
    const uniqueAnswers = new Set(answers)
    
    // Проверяем, что все ответы уникальны
    if (answers.length !== uniqueAnswers.size) {
      console.error(`❌ Тест ${i + 1} не пройден!`)
      console.error('Пары:', pairs)
      console.error('Ответы:', answers)
      allPassed = false
      break
    }
    
    // Дополнительная проверка: ищем дубликаты типа 2×4 и 4×2
    const products = pairs.map(p => {
      const [a, b] = p.question.split(' × ').map(Number)
      return a * b
    })
    
    const productCounts = products.reduce((acc, product) => {
      acc[product] = (acc[product] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    
    const duplicates = Object.entries(productCounts).filter(([_, count]) => count > 1)
    if (duplicates.length > 0) {
      console.error(`❌ Тест ${i + 1} не пройден! Найдены дубликаты продуктов:`)
      console.error('Дубликаты:', duplicates)
      console.error('Пары:', pairs)
      allPassed = false
      break
    }
  }
  
  if (allPassed) {
    console.log(`✅ Все ${iterations} тестов пройдены! Ответы уникальны.`)
  }
  
  return allPassed
}

// Функция для демонстрации работы
export const demonstrateUniqueGeneration = () => {
  console.log('🎯 Демонстрация генерации уникальных пар:')
  
  for (let i = 0; i < 5; i++) {
    const pairs = generatePairs(1, 8)
    console.log(`\nГенерация ${i + 1}:`)
    pairs.forEach(pair => {
      console.log(`  ${pair.question} = ${pair.answer}`)
    })
    
    const answers = pairs.map(p => p.answer)
    const uniqueAnswers = new Set(answers)
    console.log(`  Уникальных ответов: ${uniqueAnswers.size}/${answers.length}`)
  }
}
