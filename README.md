## Install
```
yarn install
```

### Development
```
yarn run dev
```

### Build
```
yarn run build
```

### Lint
```
yarn run lint
```

## Почему vue ?
Потому что в нем классный шаблонизатор и удобные однофайловые компоненты, все очень быстро разворачивается и настраивается. К тому же в дальшейшем я хотел бы сделать именно на vue полноценное SPA для Яндекс Дома.

# Адаптивная вёрстка
Посмотреть:  https://shri-homework-1-2.now.sh/#/events

grid раскладку можно найти в components/Events

Используется 3 различных раскладки: 
+ < 750 для мобильных одна колонка, все блоки одного размера
+ \>= 750px - две колонки, большие и средние блоки занимаю всю ширину, маленький - 1 колонку
+ \>= 1200px - 6 колонок, большой занимает всю ширину, средний 3 колонки, маленький - 2

Изначально попробовал сделать через `grid-template-areas`, однако это не гибкий способ, так как при большем количесве событий все сломается. Скорее всего тут будет инфинити скролл с подгрузкой новых событий, так что решил делать через `grid-template-columns`. Единственный нюанс - для управление положением большего блока `.event--large` (Расположен слева или справа) нужны небольшие пляски с бубном (Попробовал сделать через js [тут](https://codepen.io/deadrime/pen/Xxmozp).)
Не стал включать это, так как не уверен, что такое чередование - часть задумки.

Из непонятностей:
+ Не нашел вариативного Arial, да и вообще с кириллическими вариативными шрифтами беда, отложил на потом.
+ Исходный формат данных в `events.json` не содержит в себе различных размеров изображений, не понятно, как их делать, не меняя формата...

# Работа с сенсорным пользовательским вводом

Посмотреть: https://shri-homework-1-2.now.sh/#/camera

Пока что не успел сделать жест для изменения уровня яркости, не совсем себе представляю что это и как детектить.
