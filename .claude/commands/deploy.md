# Deploy

Виконай повний деплой процес для поточної гілки.

## Кроки

1. **Перевір поточний стан**
   ```bash
   git status
   git branch --show-current
   ```

2. **Запусти lint**
   ```bash
   npm run lint
   ```
   Якщо є помилки — зупинись і повідом. НЕ продовжуй деплой з lint помилками.

3. **Запусти production build**
   ```bash
   npm run build
   ```
   Якщо build впав — покажи помилки, зупинись. НЕ пушиш зламаний код.

4. **Запуш на remote**
   ```bash
   git push origin <current-branch>
   ```

5. **Повідом результат** — яка гілка, чи успішно, що далі.
