import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    Button,
    Input,
    Checkbox,
    TextField,
    Label,
} from "@heroui/react";

import {
    Lock,
    Envelope,
    Eye,
    EyeSlash,
    ArrowRight,
} from "@gravity-ui/icons";

import { GlassLogoProvider } from "../../components/Logo/GlassLogoScene";
import { StaticLogo } from "../../components/Logo/Logo";

function TermsModal({
    isOpen,
    onClose,
    onAccept,
    onAcceptLicense,
}: {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    onAcceptLicense: () => void;
}) {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        const element = scrollRef.current;
        if (!element) return;
        const progress = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
        setScrollProgress(Math.min(Math.max(progress, 0), 100));
    };

    useEffect(() => {
        if (isOpen) {
            setScrollProgress(0);
            setIsChecked(false);
            setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: "instant" }), 10);
        }
    }, [isOpen]);

    const canAccept = scrollProgress >= 98 && isChecked;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60]"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 30 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
                    >
                        <Card className="w-full max-w-[520px] bg-default-50 dark:bg-default-950 border border-default-300 dark:border-default-800 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="relative px-8 pt-8 pb-5 border-b border-default-200 dark:border-default-800">
                                <button onClick={onClose} className="absolute top-6 right-6 text-default-400 hover:text-foreground">✕</button>
                                <h2 className="text-2xl font-black tracking-tighter">Умови використання</h2>
                                <p className="text-default-400 mt-1.5">та Політика конфіденційності</p>
                            </div>

                            <div className="h-1.5 bg-default-200 dark:bg-default-800 relative">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"
                                    animate={{ width: `${scrollProgress}%` }}
                                />
                            </div>

                            <div
                                ref={scrollRef}
                                onScroll={handleScroll}
                                className="max-h-[520px] overflow-auto p-8 text-[15px] leading-relaxed custom-scrollbar"
                            >
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    
                                    {/* Шапка */}
                                    <div className="border-b border-default-200 dark:border-default-800 pb-4 mb-6">
                                        <h1 className="text-xl font-bold mb-2">Користувацька угода OpenQueri</h1>
                                        <p className="text-default-400 text-sm">Дата останнього оновлення: 06.05.2026</p>
                                    </div>

                                    {/* 1. Загальні положення */}
                                    <h2 className="text-base font-bold mb-3 mt-6">1. Загальні положення</h2>
                                    <p className="mb-3 text-default-600">
                                        <strong>1.1.</strong> Ця Користувацька угода (далі — Угода) регулює відносини 
                                        між правовласником OpenQueri (далі — Адміністрація, Ми, Нас, OpenQueri) та 
                                        будь-якою фізичною або юридичною особою (далі — Користувач, Ви), яка використовує 
                                        сайт https://github.com/OpenQueri (та його піддомени), сервіс OpenQueri, API, 
                                        пошуковий рушій та пов'язане програмне забезпечення (далі разом — Сервіс).
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>1.2.</strong> Угода є договором приєднання. Реєструючись на сайті, 
                                        створюючи акаунт, отримуючи доступ до Сервісу або використовуючи його в будь-якій формі 
                                        (включаючи перегляд, пошук, використання API, завантаження коду тощо), ви підтверджуєте, 
                                        що уважно прочитали, зрозуміли та повністю погоджуєтесь з усіма умовами цієї Угоди.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>1.3.</strong> Якщо ви не згодні з будь-якою умовою цієї Угоди, ви зобов'язані 
                                        утриматися від реєстрації та негайно припинити будь-яке використання Сервісу.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>1.4.</strong> Ми можемо в будь-який час в односторонньому порядку змінювати цю Угоду. 
                                        Нова редакція набирає чинності з моменту її публікації на сайті (або з дати, зазначеній у ній). 
                                        Продовження використання Сервісу після змін означає вашу згоду з оновленою версією Угоди.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>1.5.</strong> Ця Угода розроблена з урахуванням норм законодавства України, 
                                        вимог Європейського Союзу (зокрема GDPR), а також загальноприйнятих міжнародних практик. 
                                        У разі колізії норм застосовуватиметься законодавство України, якщо інше не передбачено 
                                        обов'язковими нормами міжнародного права або законодавства країни Користувача.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>1.6.</strong> Ви гарантуєте, що маєте повну дієздатність для укладення цієї Угоди 
                                        (зокрема, вам виповнилося 18 років або ви досягли віку повноліття відповідно до законодавства 
                                        вашої країни).
                                    </p>

                                    {/* 2. Реєстрація та обліковий запис */}
                                    <h2 className="text-base font-bold mb-3 mt-6">2. Реєстрація та обліковий запис</h2>
                                    <p className="mb-3 text-default-600">
                                        <strong>2.1.</strong> Деякі функції Сервісу OpenQueri (зокрема доступ до API, 
                                        розширений пошук, використання краулерів, високі ліміти запитів та інші розширені 
                                        можливості) доступні лише після реєстрації та авторизації.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>2.2.</strong> Реєструючись на Сервісі, Користувач підтверджує та гарантує, що:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 space-y-1 text-default-600">
                                        <li>йому виповнилося 18 (вісімнадцять) років або він досяг віку повноліття відповідно до законодавства країни свого проживання;</li>
                                        <li>він діє від свого імені або має всі необхідні повноваження діяти від імені юридичної особи;</li>
                                        <li>вся інформація, надана при реєстрації, є правдивою та актуальною.</li>
                                    </ul>
                                    <p className="mb-3 text-default-600">
                                        <strong>2.3.</strong> Користувач зобов'язується підтримувати актуальність своїх 
                                        реєстраційних даних протягом усього періоду використання Сервісу.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>2.4.</strong> Користувач несе повну відповідальність за конфіденційність 
                                        логіну, пароля та інших даних доступу до свого облікового запису. Всі дії, вчинені 
                                        з використанням його облікових даних, вважаються вчиненими цим Користувачем.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>2.5.</strong> Користувачу забороняється:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 space-y-1 text-default-600">
                                        <li>створювати більше одного облікового запису без попередньої письмової згоди Адміністрації;</li>
                                        <li>передавати свій обліковий запис третім особам;</li>
                                        <li>використовувати обліковий запис в цілях, що суперечать умовам цієї Угоди або законодавству;</li>
                                        <li>використовувати автоматизовані засоби для створення або управління кількома обліковими записами.</li>
                                    </ul>
                                    <p className="mb-3 text-default-600">
                                        <strong>2.6.</strong> Адміністрація має право в будь-який час без попереднього повідомлення:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 space-y-1 text-default-600">
                                        <li>відмовити у реєстрації або підтвердженні акаунта;</li>
                                        <li>обмежити або повністю припинити доступ до Сервісу через конкретний обліковий запис;</li>
                                        <li>вимагати додаткову інформацію для підтвердження особи або цілей використання.</li>
                                    </ul>
                                    <p className="mb-3 text-default-600">
                                        <strong>2.7.</strong> Адміністрація не здійснює обов'язкову верифікацію документів Користувача 
                                        через відсутність відповідних технічних та організаційних можливостей. Користувач самостійно 
                                        несе відповідальність за легальність свого використання Сервісу.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>2.8.</strong> Видалення або блокування облікового запису не звільняє Користувача 
                                        від виконання зобов'язань та відповідальності, що виникли до моменту блокування/видалення.
                                    </p>

                                    {/* 3. Ліцензія та інтелектуальна власність */}
                                    <h2 className="text-base font-bold mb-3 mt-6">3. Ліцензія та інтелектуальна власність</h2>
                                    <p className="mb-3 text-default-600">
                                        <strong>3.1.</strong> OpenQueri є відкритим програмним забезпеченням (open source) 
                                        і поширюється під відкритою ліцензією MIT License.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>3.2.</strong> Будь-яка фізична або юридична особа має право безкоштовно:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 space-y-1 text-default-600">
                                        <li>завантажити вихідний код;</li>
                                        <li>встановити;</li>
                                        <li>використовувати;</li>
                                        <li>вивчати;</li>
                                        <li>модифікувати;</li>
                                        <li>поширювати (в тому числі комерційно).</li>
                                    </ul>
                                    <p className="mb-3 text-default-600">
                                        OpenQueri у формі вихідного коду доступний для вільного використання відповідно до умов MIT License.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>3.3.</strong> Повний текст ліцензії MIT License розміщено у файлі LICENSE у офіційному 
                                        репозиторії проєкту.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>3.4.</strong> Copyright (c) 2026 OpenQueri. Усі авторські права на оригінальний код, 
                                        архітектуру, логотип, назву та інші об'єкти інтелектуальної власності належать правовласнику OpenQueri.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>3.5.</strong> Використовуючи код OpenQueri, Користувач зобов'язується неухильно дотримуватися 
                                        умов MIT License. Зокрема, обов'язковою умовою є збереження в усіх копіях або суттєвих частинах 
                                        Програмного забезпечення оригінального повідомлення про авторські права...
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>3.6.</strong> Ця Користувацька угода доповнює MIT License, але не замінює її. У разі 
                                        суперечності пріоритет має MIT License.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>3.7.</strong> Вносячи будь-які зміни, виправлення, pull requests або інші вклади в проєкт, 
                                        Користувач автоматично надає їх на умовах MIT License і не може вимагати іншої ліцензії або винагороди.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>3.8.</strong> Назва OpenQueri, логотип та інші торговельні марки є інтелектуальною власністю 
                                        Адміністрації. Їх використання без окремої письмової згоди заборонено.
                                    </p>

                                    {/* 4. Права та обов'язки Користувача */}
                                    <h2 className="text-base font-bold mb-3 mt-6">4. Права та обов'язки Користувача</h2>
                                    <p className="mb-3 text-default-600"><strong>4.1.</strong> Користувач має право:</p>
                                    <ul className="list-disc pl-6 mb-4 space-y-1 text-default-600">
                                        <li>Використовувати Сервіс OpenQueri для здійснення пошукових запитів, доступу через API та інші доступні функції в межах встановлених лімітів.</li>
                                        <li>Завантажувати, встановлювати та використовувати вихідний код OpenQueri відповідно до умов MIT License.</li>
                                        <li>Вносити пропозиції щодо покращення проєкту, створювати issues та pull requests в офіційному репозиторії.</li>
                                        <li>У будь-який момент припинити використання Сервісу та видалити свій обліковий запис.</li>
                                    </ul>
                                    <p className="mb-3 text-default-600"><strong>4.2.</strong> Користувач зобов'язується:</p>
                                    <ul className="list-disc pl-6 mb-4 space-y-1 text-default-600">
                                        <li>Використовувати Сервіс виключно в законних цілях і не порушувати чинне законодавство.</li>
                                        <li>Не використовувати Сервіс для порушення авторських прав, поширення спаму, DDoS-атак, незаконного збору даних тощо.</li>
                                        <li>Дотримуватися технічних обмежень Сервісу (rate limits, quotas, правила краулінгу).</li>
                                        <li>Поважати правила веб-сайтів, які індексує або відвідує краулер (robots.txt).</li>
                                        <li>Не навантажувати сервери OpenQueri надмірно.</li>
                                        <li>Не передавати свої облікові дані третім особам.</li>
                                        <li>Негайно повідомляти Адміністрацію про будь-які виявлені вразливості.</li>
                                    </ul>
                                    <p className="mb-3 text-default-600"><strong>4.3.</strong> Користувачу забороняється:</p>
                                    <ul className="list-disc pl-6 mb-4 space-y-1 text-default-600">
                                        <li>Здійснювати реверс-інженерію, декомпіляцію або інше втручання в роботу сервісної (закритої) частини OpenQueri.</li>
                                        <li>Видавати себе за іншу особу або представляти свої дії як дії Адміністрації.</li>
                                        <li>Використовувати автоматизовані засоби для масового збору інформації без дотримання технічних обмежень Сервісу.</li>
                                        <li>Продавати, передавати або надавати доступ до свого акаунту / API-ключів третім особам.</li>
                                    </ul>
                                    <p className="mb-3 text-default-600">
                                        <strong>4.4.</strong> Порушення будь-якого з обов'язків або заборон дає Адміністрації право 
                                        негайно обмежити, заблокувати або видалити обліковий запис Користувача без попередження.
                                    </p>

                                    {/* 5. Обмеження відповідальності */}
                                    <h2 className="text-base font-bold mb-3 mt-6">5. Обмеження відповідальності. Надання Сервісу «ЯК Є»</h2>
                                    <p className="mb-3 text-default-600">
                                        <strong>5.1.</strong> Сервіс OpenQueri та його вихідний код надаються «ЯК Є» (AS IS) та 
                                        «ЯК ДОСТУПНО» (AS AVAILABLE) без будь-яких гарантій.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>5.2.</strong> Адміністрація не надає жодних прямих або опосередкованих гарантій.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>5.3.</strong> Адміністрація не несе відповідальності за будь-які наслідки 
                                        використання або неможливості використання Сервісу.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>5.4.</strong> У максимальній мірі, дозволеній чинним законодавством, Адміністрація 
                                        не несе відповідальності перед Користувачем за будь-які прямі, непрямі, випадкові, 
                                        спеціальні, наслідкові або штрафні збитки.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>5.5.</strong> Користувач визнає та погоджується, що використання Сервісу відбувається 
                                        на його власний ризик та під його особисту відповідальність.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>5.6.</strong> OpenQueri поширюється як відкрите програмне забезпечення (open source). 
                                        Адміністрація <strong className="text-red-500 dark:text-red-400">не несе жодної відповідальності</strong> за будь-які дії, 
                                        вчинені Користувачем з використанням копії OpenQueri, встановленої на потужностях Користувача.
                                    </p>
                                    <div className="bg-default-100 dark:bg-default-800 p-4 rounded-xl my-4 border-l-4 border-blue-500">
                                        <p className="text-sm font-medium text-foreground mb-1">Важливо:</p>
                                        <p className="text-sm text-default-600">
                                            Весь ризик, пов'язаний із використанням OpenQueri, повністю лежить на Користувачеві. 
                                            Адміністрація не контролює, як Користувач використовує копію OpenQueri, встановлену 
                                            на його власних серверах.
                                        </p>
                                    </div>

                                    {/* 6. Персональні дані та GDPR */}
                                    <h2 className="text-base font-bold mb-3 mt-6">6. Персональні дані та конфіденційність (GDPR)</h2>
                                    <p className="mb-3 text-default-600">
                                        <strong>6.1.</strong> OpenQueri <strong className="text-green-600 dark:text-green-400">не збирає, не обробляє, не зберігає та не передає</strong> 
                                        третім особам жодних персональних даних Користувачів.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>6.2.</strong> Технічні дані (IP-адреса, тип браузера, час запиту) можуть бути 
                                        тимчасово доступні виключно для забезпечення відповіді на запит, захисту від зловживань 
                                        та діагностики помилок. Ця інформація <strong className="text-red-500 dark:text-red-400">НІКОЛИ не записується на диск</strong> 
                                        та не зберігається.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>6.3.</strong> OpenQueri не використовує маркетингові, аналітичні або сторонні файли cookie.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>6.4.</strong> Ми не використовуємо Google Analytics, Яндекс.Метрику, Facebook Pixel, 
                                        Hotjar або будь-які інші інструменти аналітики, відстеження або збору даних.
                                    </p>
                                    <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl my-4 border-l-4 border-green-500">
                                        <p className="text-sm font-medium text-foreground mb-1">Ваша конфіденційність захищена:</p>
                                        <p className="text-sm text-default-600">
                                            Оскільки OpenQueri не зберігає персональних даних, питання транскордонної передачі 
                                            даних не виникає, а реалізація прав GDPR не потребує додаткових дій.
                                        </p>
                                    </div>

                                    {/* 7. Припинення доступу */}
                                    <h2 className="text-base font-bold mb-3 mt-6">7. Припинення доступу</h2>
                                    <p className="mb-3 text-default-600">
                                        <strong>7.1.</strong> Ця Угода набирає чинності з моменту першого використання Сервісу 
                                        Користувачем і діє до моменту її припинення однією зі сторін.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>7.2.</strong> Користувач має право в будь-який момент припинити дію Угоди шляхом 
                                        видалення свого облікового запису або припинення використання Сервісу.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>7.3.</strong> Адміністрація має право без попередження призупинити або припинити 
                                        доступ до Сервісу у разі порушення Користувачем умов цієї Угоди.
                                    </p>

                                    {/* 8. Заключні положення */}
                                    <h2 className="text-base font-bold mb-3 mt-6">8. Заключні положення</h2>
                                    <p className="mb-3 text-default-600">
                                        <strong>8.1.</strong> Ця Угода регулюється законодавством України. Для Користувачів з ЄС 
                                        додатково застосовуються положення GDPR.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>8.2.</strong> Спори вирішуються шляхом переговорів, а за їх недосягненням — 
                                        за місцезнаходженням відповідача.
                                    </p>
                                    <p className="mb-3 text-default-600">
                                        <strong>8.3-8.7.</strong> Угода є повним договором між сторонами. Якщо будь-яке положення 
                                        буде визнано недійсним, інші залишаються чинними. Українська версія має пріоритет.
                                    </p>

                                </div>
                            </div>

                     
                            <div className="px-8 pt-4 pb-2">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => setIsChecked(e.target.checked)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 mt-0.5 rounded-md border-2 
                                                    border-default-300 dark:border-default-700
                                                    bg-white dark:bg-default-900
                                                    transition-all duration-200
                                                    peer-checked:border-blue-500 peer-checked:bg-blue-500
                                                    group-hover:border-blue-400 dark:group-hover:border-blue-500
                                                    peer-focus:ring-2 peer-focus:ring-blue-500/20
                                                    peer-focus:ring-offset-0
                                                    shadow-sm"
                                        />
                                        <svg
                                            className="absolute top-0.5 left-0.5 w-4 h-4 text-white 
                                                    transition-all duration-200 scale-0 peer-checked:scale-100"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-foreground 
                                                    leading-relaxed select-none
                                                    group-hover:text-blue-600 dark:group-hover:text-blue-400
                                                    transition-colors duration-200">
                                        Я ознайомлений(а) з Користувацькою угодою OpenQueri, повністю розумію її умови та беззастережно погоджуюся з ними. Також я підтверджую, що мені виповнилося 18 років (або я досяг(ла) повноліття згідно із законодавством моєї країни).
                                    </span>
                                </label>
                            </div>

                            <div className="p-6 border-t flex gap-3">
                                <Button variant="tertiary" onClick={onClose} className="flex-1 h-12">
                                    Скасувати
                                </Button>
                                <Button 
                                    onClick={onAccept} 
                                    isDisabled={!canAccept}  // Кнопка активна тільки якщо прокручено і чекбокс відмічений
                                    className="flex-1 h-12 font-bold"
                                >
                                    {scrollProgress >= 98 && isChecked 
                                        ? "Я приймаю умови" 
                                        : !isChecked 
                                            ? "Підтвердіть згоду" 
                                            : "Прокрутіть до кінця"}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showTerms, setShowTerms] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!email) newErrors.email = "Введіть email";
        else if (!email.includes("@")) newErrors.email = "Невірний формат email";

        if (!isLogin) {
            if (!username) newErrors.username = "Введіть ім'я користувача";
            if (!password) newErrors.password = "Введіть пароль";
            if (password !== confirmPassword) newErrors.confirmPassword = "Паролі не співпадають";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            alert(isLogin ? "Вхід успішний!" : "Реєстрація успішна!");
        }
    };

    const handleCheckboxClick = () => {
        if (!termsAccepted) setShowTerms(true);
        else setTermsAccepted(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-white dark:bg-zinc-950 transition-colors duration-500" />
                <motion.div
                    animate={{
                        background: [
                            "radial-gradient(circle at 20% 20%, var(--bg-spotlight) 0%, transparent 40%)",
                            "radial-gradient(circle at 80% 80%, var(--bg-spotlight) 0%, transparent 40%)",
                            "radial-gradient(circle at 20% 80%, var(--bg-spotlight) 0%, transparent 40%)",
                        ],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-40 dark:opacity-20"
                    style={{
                        '--bg-spotlight': 'rgba(120, 119, 198, 0.3)' 
                    } as any}
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150"></div>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
                <div className="hidden lg:flex flex-col justify-center items-center relative">
                    <div className="relative w-full max-w-[420px]">
                        <div className="absolute -inset-20 bg-blue-600/10 dark:bg-blue-600/5 rounded-[6rem] blur-3xl" />
                        <GlassLogoProvider is3D={false} width="100%" height="100%">
                            <StaticLogo className="w-full h-full drop-shadow-2xl" />
                        </GlassLogoProvider>
                        <div className="mt-10 text-center">
                            <h2 className="text-5xl font-black tracking-tighter text-foreground">OpenQueri</h2>
                            <p className="text-foreground/60 mt-3 text-xl font-medium tracking-tight">Інший підхід. Енергія Rust.</p>
                        </div>
                    </div>
                </div>

                <Card className="bg-default-50/80 dark:bg-default-50/30 backdrop-blur-3xl border border-default-200 p-10 md:p-12 rounded-[3rem] shadow-2xl w-full max-w-[480px] mx-auto">
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex bg-default-100 p-1 rounded-full">
                            <div onClick={() => setIsLogin(true)} className={`px-6 py-2 rounded-full text-sm font-bold cursor-pointer transition-all ${isLogin ? "bg-foreground text-background" : "text-default-500"}`}>Увійти</div>
                            <div onClick={() => setIsLogin(false)} className={`px-6 py-2 rounded-full text-sm font-bold cursor-pointer transition-all ${!isLogin ? "bg-foreground text-background" : "text-default-500"}`}>Реєстрація</div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? "login" : "register"}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h1 className="text-4xl font-black tracking-tighter text-center mb-2">
                                {isLogin ? "З поверненням" : "Створити акаунт"}
                            </h1>
                            <p className="text-default-400 text-center mb-10">
                                {isLogin ? "Увійдіть, щоб продовжити пошук" : "Приєднуйтесь до спільноти OpenQueri"}
                            </p>

                            <div className="space-y-6">
                                <TextField>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        classNames={{ inputWrapper: "h-14 rounded-2xl" }}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </TextField>

                                {!isLogin && (
                                    <TextField>
                                        <Label>Ім'я користувача</Label>
                                        <Input
                                            type="text"
                                            placeholder="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            classNames={{ inputWrapper: "h-14 rounded-2xl" }}
                                        />
                                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                                    </TextField>
                                )}

                                <TextField>
                                    <Label>Пароль</Label>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        classNames={{ inputWrapper: "h-14 rounded-2xl" }}
                                        endContent={
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-3 text-default-400 hover:text-foreground transition-colors">
                                                {showPassword ? <EyeSlash /> : <Eye />}
                                            </button>
                                        }
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </TextField>

                                {!isLogin && (
                                    <TextField>
                                        <Label>Підтвердіть пароль</Label>
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            classNames={{ inputWrapper: "h-14 rounded-2xl" }}
                                            endContent={
                                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="pr-3 text-default-400 hover:text-foreground transition-colors">
                                                    {showConfirmPassword ? <EyeSlash /> : <Eye />}
                                                </button>
                                            }
                                        />
                                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                                    </TextField>
                                )}

                                {!isLogin && (
                                    <div className="flex items-start gap-3 pt-2">
                                        <Checkbox isSelected={termsAccepted} onChange={handleCheckboxClick} />
                                        <p className="text-sm text-default-500 leading-tight cursor-pointer" onClick={handleCheckboxClick}>
                                            Я погоджуюсь з{" "}
                                            <span className="text-blue-500 hover:underline">Умовами використання</span> та{" "}
                                            <span className="text-blue-500 hover:underline">Політикою конфіденційності</span>
                                        </p>
                                    </div>
                                )}

                                <Button
                                    size="lg"
                                    className="w-full h-14 rounded-2xl font-black text-base mt-4"
                                    isDisabled={!isLogin && !termsAccepted}
                                    onPress={handleSubmit}
                                >
                                    {isLogin ? "Увійти" : "Створити акаунт"} <ArrowRight className="ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </Card>
            </div>

            <TermsModal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                onAccept={() => {
                    setTermsAccepted(true);
                    setShowTerms(false);
                }}
            />
        </div>
    );
}