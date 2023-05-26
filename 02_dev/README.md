# Домашнее задание к занятию «1.2. Популярные языки, системы сборки, управления зависимостями»

## Задание SonarQube

На лекции мы с вами говорили, что исходный код приложения — это источник потенциальных уязвимостей.

Конечно же, исходный код приложения можно проверить и глазами, но при современных объёмах кода — это достаточно трудоемкая задача.

Поэтому существуют специальные инструменты, которые позволяют анализировать качество кода, в том числе пытаются найти в нём уязвимости.

С одним из подобных инструментов ([SonarQube](https://www.sonarqube.org/)) мы познакомимся в этом ДЗ, альтернативы рассмотрим на одной из следующих лекций.

**Важно**: вам не нужно учить Java и детально разбираться в коде. Ваши задачи:
1. Получить базовый опыт работы с инструментом.
1. Проанализировать предупреждения, баги и уязвимости.

## Описание проекта

Мы подготовили для вас учебный проект, написанный на языке Java и использующий систему сборки Maven.

Проект представляет собой веб-сервер, работающий на порту 8080 и отвечающий HTTP-запросам.

Страница http://localhost:8080/users.html закрыта логином и паролем admin/secret.

Чтобы собрать образ и запустить его (это необязательно для выполнения ДЗ), вам нужно:
1. Скачать [app.tgz](assets/app.tgz).
1. Скачать [Dockerfile](assets/Dockerfile).
1. Скачать [docker-compose.yml](assets/docker-compose.yml).
1. В каталоге со скачанными файлами выполнить: `docker-compose up --build ibdev`.

## Результаты выполнения

Отправьте в личном кабинете студента ответы на следующие вопросы:
1. Какие баги были выявлены: количество, описание, почему SonarQube их считает багами? См. ссылку `Why is this an issue?`.
1. Какие уязвимости были выявлены: количество, категории, описание, почему SonarQube их считает уязвимостями?
1. Какие Security Hotspots были выявлены: количество, категории, приоритет, описание, почему SonarQube их считает Security HotSpot'ами?
1. К каким CWE идёт отсылка для Security Hotspots из п. 2? См. вкладку `How can you fix it?` в нижней части страницы.
1. Какие запахи кода были выявлены: количество, описание, почему SonarQube их считает запахами кода? См. ссылку `Why is this an issue?`.

## Ответы
1. Был выявлен 1 баг, суть которого, судя по описанию в том, что "хоть технически и корректно объявлять параметры в теле метода, делать это до того, как значение параметра будет прочитано вероятно является ошибкой". SonarQube предлагает объявлять новую переменную, вместо того, чтобы повторно использовать параметр "clean"
![](/02_dev/pic/bug.JPG)
1. Была обнаружена 1 серьезная уязвимость категории "blocker", заключающаяся в том, что необходимо добавить защиту паролем для базы данных. Базы данных всегда должны быть защищены паролем. Использование соединения с базой данных с пустым паролем является явным признаком того, что база данных не защищена. Это правило помечает подключения к базе данных с пустыми паролями.
![](/02_dev/pic/vuln.JPG)
1. Было выявлено 1 нарушение Security Hotspots, которое сигнализирует о том, что конфигурация приложения на данном этапе разработки не безопасна и необходимо отключить отмеченную функцию отладки перед тем как развертывать приложение на "живом" сервере.
![](/02_dev/pic/sechotspots.JPG)
1. CWE-489: Active Debug Code (Продукт развертывается для неавторизованных участников с включенным или активным кодом отладки, который может создавать непреднамеренные точки входа или раскрывать конфиденциальную информацию. Обычная практика разработки заключается в добавлении «черного хода» кода, специально разработанного для целей отладки или тестирования, который не предназначен для поставляться или развертываться вместе с продуктом. Эти лазейки создают риски для безопасности, поскольку они не учитываются при проектировании или тестировании и выходят за рамки ожидаемых условий эксплуатации продукта.), CWE-215: Insertion of Sensitive Information Into Debugging Code(Продукт вставляет конфиденциальную информацию в код отладки, что может привести к раскрытию этой информации, если код отладки не отключен в рабочей среде. При отладке может возникнуть необходимость сообщить подробную информацию программисту. Однако если код отладки не отключен, когда продукт работает в производственной среде, эта конфиденциальная информация может стать доступной для злоумышленников.)
1. Было выявлено 5 "запахов кода". 1 Minor(незначительное нарушение) и 4 Major(значительное нарушение), с которыми разберемся по отдельности
  * Minor. Remove this unused import 'java.io.IOException'. Ненужные импорты должны быть удалены. Т.е. если данный модуль не используется в коде, его импорт -нецелесообразен.
  ![](/02_dev/pic/smell1.JPG)
  * Major. Replace this use of System.out or System.err by a logger. Стандартный вывод не должен использоваться напрямую для записи логов чего-либо. Вот почему настоятельно рекомендуется определить и использовать специальный регистратор.
  ![](/02_dev/pic/smell2.JPG)
  * Major. Remove this expression which always evaluates to "true". Необходимо удалить это булево выражение, которое всегда возвращает "истину". Если логическое выражение не изменяет оценку условия, то оно совершенно не нужно и может быть удалено. Если оно является необоснованным, поскольку не соответствует замыслу программиста, то это ошибка, и выражение следует исправить.
  ![](/02_dev/pic/smell3.JPG)
  * Major x2. Define and throw a dedicated exception instead of using a generic one.Необходимо определить и сгенерировать специальное исключение вместо использования универсального. Использование таких универсальных исключений, как Error, RuntimeException, Throwable и Exception, не позволяет вызывающим методам обрабатывать истинные системные исключения иначе, чем ошибки, генерируемые приложением.
  ![](/02_dev/pic/smell4.JPG)
  ![](/02_dev/pic/smell5.JPG)