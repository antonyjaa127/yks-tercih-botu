"use client";
import React from "react";
import styles from "./rehber.module.css";

const tercihTabloData = [
  {
    section: "1. KISIM (Sürpriz Yerler)",
    range: "1-6",
    description:
      "Bu bölümdeki tercihler senin sıralamandan daha iyi programlardan oluşmalıdır. Örneğin: Eşit ağırlıkta 100 bin sıralamada olan bir öğrenci sıralamasını 0.70 ile çarpacak. Bu da 70 bine denk düşecektir. Listesini buradan başlatabilir.",
    oranlar: [
      { label: "Sayısal", value: "0.70", color: "red" },
      { label: "Sözel", value: "0.65", color: "red" },
      { label: "Eşit Ağırlık", value: "0.70", color: "red" },
      { label: "Dil", value: "0.75", color: "red" },
      { label: "TYT", value: "0.50", color: "red" },
    ],
  },
  {
    section: "2. KISIM (Yerleşmenin Muhtemel Olduğu Yerler)",
    range: "7-19",
    description:
      "Bu bölümdeki tercihler senin sıralamana yakın programlardan oluşmalıdır. Örneğin: 100 bin sıralamadaki bir öğrenci sıralamasını 0.9 ve 1.1 ile çarpacak. Bu oran tüm bölümler için geçerlidir. Bu da 90 bin ile 110 bin arasına denk düşecektir. Bu aralıktaki programlar yazılabilir.",
    oranlar: [
      { label: "Tüm Bölümler", value: "0.9 - 1.1", color: "red" },
    ],
  },
  {
    section: "3. KISIM (Güvenli Yerler)",
    range: "20-24",
    description:
      "Bu bölümdeki tercihler senin sıralamandan daha düşük programlardan oluşmalıdır. En kötü burası da gelse okurum, benim için fena değil aralığı. Örneğin: 100 bin sıralamada olan bir öğrenci sıralamasını 1.8 ile çarpacak. Bu da 180 bine denk düşecektir. Listesini buradan bitirebilir.",
    oranlar: [
      { label: "Sayısal", value: "1.7", color: "red" },
      { label: "Sözel", value: "1.8", color: "red" },
      { label: "Eşit Ağırlık", value: "1.9", color: "red" },
      { label: "Dil", value: "1.5", color: "red" },
      { label: "TYT", value: "2.5", color: "red" },
    ],
  },
];

const rehberData = [
  {
    title: "Tercih Sürecinin Temelleri",
    items: [
      {
        subtitle: "Tercih Puanınız Nasıl Hesaplanır?",
        content:
          'Tercih yaparken kullanacağınız "Yerleştirme Puanı", sınavdan aldığınız puana lise diploma notunuzun (Ortaöğretim Başarı Puanı - OBP) eklenmesiyle oluşur. Liseden aldığınız 100\'lük diploma notunuz 5 ile çarpılarak OBP\'niz oluşturulur (En düşük 250, en yüksek 500 puan). Bu OBP, 0,12 katsayısıyla çarpılarak ham sınav puanınıza eklenir ve Yerleştirme Puanınız ortaya çıkar.',
      },
      {
        subtitle: "OBP Kırılması Nedir?",
        content:
          "Eğer 2023-YKS puanıyla bir programa yerleştirildiyseniz (kayıt yaptırmamış olsanız bile), bu yıl OBP'nizin çarpılacağı katsayılar yarıya düşürülür. Bu durum, yerleştirme puanınızı ve sıralamanızı önemli ölçüde etkileyebilir.",
      },
      {
        subtitle: "Ek Puan Avantajı Kimler İçin Geçerli?",
        content:
          "Mesleki ve teknik lise mezunuysanız, kendi alanınızın devamı niteliğindeki lisans (Tablo-3A, Tablo-3B.1) ve ön lisans (Tablo-3C) programlarını tercih ettiğinizde ek puan alırsınız. Bu durumda OBP'niz ayrıca 0,06 katsayısıyla çarpılarak yerleştirme puanınıza eklenir. Not: Lisans programları için ek puan uygulaması, ilgili ortaöğretim kurumuna 30 Mart 2012 tarihinden önce kayıt yaptıran adaylar için geçerlidir.",
      },
      {
        subtitle: "Tercih Listesi Nasıl Oluşturulur?",
        content:
          "En fazla 24 program tercih edebilirsiniz. Listenin tamamını doldurmak zorunda değilsiniz. Yerleştirme, puan ve başarı sıranız dikkate alınarak, yazdığınız tercih sırasına göre yapılır. Bu nedenle, en çok istediğiniz programı en üste yazmalısınız.",
      },
      {
        subtitle: "Başarı Sırası mı, Puan mı Daha Önemli?",
        content:
          "Tercih yaparken puanınızdan çok başarı sıranızı dikkate almalısınız. Sınavın zorluk seviyesine göre puanlar her yıl değişebilir ancak başarı sıraları daha istikrarlı bir veridir.",
      },
    ],
  },
  {
    title: "Dikkat Edilmesi Gereken Özel Durumlar ve Kontenjanlar",
    items: [
      {
        subtitle: "Başarı Sırası Barajları",
        content: `Bazı programları tercih edebilmek için belirli bir başarı sırasına ulaşmış olmanız gerekir. Bu barajlar şunlardır:\n- Hukuk: EA en düşük 125.000\n- Tıp: SAY en düşük 50.000\n- Diş Hekimliği: SAY en düşük 80.000\n- Eczacılık: SAY en düşük 100.000\n- Mimarlık: SAY en düşük 250.000\n- Mühendislik (istisnalar hariç): SAY en düşük 300.000\n- Öğretmenlik (PDR dâhil): ilgili puan türünde en düşük 300.000`,
      },
      {
        subtitle: "Okul Birinciliği Kontenjanı",
        content: `Lisenizi birincilikle bitirdiyseniz, size özel ayrılan Okul Birincisi Kontenjanı&#39;nı kullanabilirsiniz. Sistem sizi, genel kontenjan ve okul birincisi kontenjanından hangisi daha avantajlıysa ona göre yerleştirmeye çalışır.`,
      },
      {
        subtitle: "34 Yaş Üstü Kadınlar Kontenjanı",
        content: `1 Ocak 2024 itibarıyla 34 yaşını tamamlamış bir kadınsanız, devlet üniversitelerindeki belirli ön lisans ve lisans programlarında (Tıp, Hukuk, Mühendislik gibi barajı olan programlar hariç) size özel ayrılan kontenjanları tercih edebilirsiniz. Daha önce herhangi bir lisans programından mezun olduysanız bu kontenjandan yararlanamazsınız.`,
      },
      {
        subtitle: "Depremzede Aday Kontenjanı",
        content: `6 Şubat 2023 tarihi itibarıyla Adana, Adıyaman, Diyarbakır, Elazığ, Gaziantep, Hatay, Kahramanmaraş, Kilis, Malatya, Osmaniye ve Şanlıurfa illerinde ikamet ediyorsanız veya bu illerdeki bir liseden mezunsanız, sizin için ayrılan Depremzede Aday Kontenjanı&#39;ndan faydalanabilirsiniz. Ancak, hâlihazırda herhangi bir yükseköğretim programına kayıtlıysanız, mezunsanız veya kaydınız silinmişse bu kontenjanı kullanamazsınız.`,
      },
      {
        subtitle: "Şehit ve Gazi Yakınları Kontenjanı",
        content: `Vakıf üniversitelerinde şehit eş ve çocukları ile gazi ve gazi eş ve çocukları için burslu öğrenci kontenjanları bulunmaktadır.`,
      },
    ],
  },
  {
    title: "Yapay Zeka Tercih Botu Kullanım Kılavuzu",
    items: [
      {
        subtitle: "Bot Nasıl Çalışır?",
        content: (
          <>
            <span className={styles.important}>Yapay zeka botumuz</span>, YKS sonuçlarınızı (<span className={styles.highlight}>puan</span>, <span className={styles.highlight}>başarı sırası</span>, <span className={styles.highlight}>OBP</span>) ve tercih eğilimlerinizi analiz ederek size en uygun üniversite ve bölümleri önerir. Sıralamanıza göre <span className={styles.important}>'Sürpriz'</span>, <span className={styles.important}>'Muhtemel'</span> ve <span className={styles.important}>'Güvenli'</span> olarak kategorize edilmiş tercih listeleri oluşturmanıza yardımcı olur. Bot, <span className={styles.highlight}>güncel kontenjan</span>, <span className={styles.highlight}>taban puan</span>, <span className={styles.highlight}>başarı sırası</span> ve <span className={styles.highlight}>özel kontenjan koşulları</span>nı da dikkate alır. Ayrıca, tercih listenizi oluştururken <span className={styles.important}>şehir</span>, <span className={styles.important}>burs</span>, <span className={styles.important}>üniversite türü</span> gibi filtrelerle aramanızı daraltabilir, <span className={styles.important}>karşılaştırma özelliği</span>yle iki veya daha fazla üniversiteyi detaylı olarak yan yana görebilirsiniz.
          </>
        ),
      },
      {
        subtitle: "Tercihlerimi Nasıl Daha Kesinleştiririm?",
        content: (
          <ul className={styles.sssList}>
            <li><span className={styles.important}>Başarı sıranızı</span> ve <span className={styles.important}>puanınızı</span> eksiksiz girin.</li>
            <li><span className={styles.important}>OBP'nizi</span> (lise diploma notu) ve mezun olduğunuz lise türünü belirtin.</li>
            <li>Hedeflediğiniz <span className={styles.important}>şehirleri</span>, <span className={styles.important}>üniversite türlerini</span> (devlet, vakıf, KKTC vb.) ve <span className={styles.important}>bursluluk durumunu</span> seçin.</li>
            <li><span className={styles.important}>İlgi alanlarınızı</span> ve <span className={styles.important}>meslek hedeflerinizi</span> belirtin.</li>
            <li>Karşılaştırmak istediğiniz <span className={styles.important}>üniversite/bölümleri</span> seçerek detaylı analiz alın.</li>
            <li>Ne kadar çok ve doğru bilgi girerseniz, botun önerileri o kadar <span className={styles.highlight}>kişiselleştirilmiş</span> ve <span className={styles.highlight}>isabetli</span> olur.</li>
            <li>Ayrıca, tercih listenizi oluşturduktan sonra listenizi <span className={styles.important}>kaydedebilir</span>, <span className={styles.important}>çıktısını alabilir</span> veya <span className={styles.important}>e-posta ile kendinize gönderebilirsiniz</span>.</li>
          </ul>
        ),
      },
      {
        subtitle: "Sıkça Sorulan Sorular (SSS)",
        content: (
          <ul className={styles.sssList}>
            <li><span className={styles.important}>Botun önerileri kesin yerleşme garantisi verir mi?</span><br/>Hayır, öneriler istatistiksel ve geçmiş verilere dayalıdır; kesinlik garantisi vermez.</li>
            <li><span className={styles.important}>Tercih listemi kaç defa oluşturabilirim?</span><br/>Sınırsız sayıda tercih listesi oluşturabilir, kaydedebilir ve güncelleyebilirsiniz.</li>
            <li><span className={styles.important}>Karşılaştırma özelliği nasıl çalışır?</span><br/>İki veya daha fazla üniversite/bölümü seçip, taban puan, başarı sırası, burs, şehir, kampüs olanakları gibi kriterlerde yan yana karşılaştırabilirsiniz.</li>
            <li><span className={styles.important}>Hatalı veya eksik veri girersem ne olur?</span><br/>Bot sizi uyarır ve eksik/hatalı alanları doldurmanızı ister.</li>
            <li><span className={styles.important}>Geri bildirim ve destek nasıl sağlanır?</span><br/>Her sayfanın altında bulunan {'Geri Bildirim'} butonunu kullanarak öneri, hata veya destek taleplerinizi iletebilirsiniz. Ekibimiz en kısa sürede dönüş sağlar.</li>
          </ul>
        ),
      },
      {
        subtitle: "Hata Ayıklama ve Geri Bildirim",
        content: (
          <span>
            Sistemle ilgili bir hata ile karşılaşırsanız veya öneriniz varsa, sayfanın altındaki <span className={styles.important}>{'Geri Bildirim'}</span> butonunu kullanabilirsiniz. Ayrıca, botun önerilerinde anlamadığınız veya yanlış bulduğunuz bir durum olursa, detaylı açıklama ve ekran görüntüsüyle birlikte bize iletebilirsiniz. Kullanıcı deneyimini geliştirmek için tüm geri bildirimleriniz <span className={styles.highlight}>titizlikle değerlendirilir</span>.
          </span>
        ),
      },
    ],
  },
];

function TercihKartlari() {
  return (
    <div className={styles.tabloWrapper}>
      {tercihTabloData.map((row, idx) => (
        <div className={styles.tercihCard} key={idx}>
          <div className={styles.cardStripe}></div>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <span className={styles.cardNumber}>{idx + 1}</span>
              <span className={styles.cardTitle}>{row.section}</span>
              <span className={styles.cardRange}>{row.range}</span>
            </div>
            <div className={styles.cardDesc}>{row.description}</div>
            <div className={styles.cardOranlar}>
              {row.oranlar.map((oran, i) => (
                <span
                  key={i}
                  className={
                    styles.oranBadge +
                    (oran.color === "red"
                      ? " " + styles["oranBadge"] + " " + styles["red"]
                      : "")
                  }
                >
                  <b>{oran.label}:</b> {oran.value}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RehberPage() {
  return (
    <main className={styles.rehberMain}>
      <section className={styles.heroSection}>
        <h1>Tercih Rehberi</h1>
        <p>
          Üniversite tercih sürecinde yol gösterici bilgiler ve sık sorulan soruların yanıtları burada! Aşağıda tercih listesinin nasıl oluşturulacağına dair detaylı bir tablo ve açıklamalar bulabilirsiniz.
        </p>
      </section>
      <section className={styles.imageSection}>
        <TercihKartlari />
        <div className={styles.imageExplanation}>
          <h2>Tercih Listesi Nasıl Oluşturulur?</h2>
          <p>
            Tercih listenizi üç ana gruba ayırmalısınız: Sürpriz (yüksek), muhtemel ve güvenli tercihler. Her grup için önerilen sıralama aralıkları ve çarpan oranları farklıdır. Tabloyu dikkatlice inceleyerek kendi sıralamanıza uygun tercih aralıklarını belirleyebilirsiniz. <br />
            <b>1. Kısım (Sürpriz Yerler):</b> Sıralamanızdan daha iyi programlar. <br />
            <b>2. Kısım (Muhtemel Yerler):</b> Sıralamanıza yakın programlar. <br />
            <b>3. Kısım (Güvenli Yerler):</b> Sıralamanızdan daha düşük programlar. <br />
            Her bölümdeki çarpan oranlarını kullanarak tercih listenizi daha bilinçli oluşturabilirsiniz.
          </p>
        </div>
      </section>
      <section className={styles.guideSection}>
        {rehberData.map((section, idx) => (
          <div key={idx} className={styles.guideBlock}>
            <h2>{section.title}</h2>
            <ul className={styles.guideList}>
              {section.items.map((item, i) => (
                <li key={i} className={styles.guideItem}>
                  <span className={styles.guideIcon}></span>
                  <div className={styles.guideContent}>
                    <div className={styles.guideTitle}>{item.subtitle}</div>
                    <div className={styles.guideText} style={{whiteSpace: 'pre-line'}}>{item.content}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}