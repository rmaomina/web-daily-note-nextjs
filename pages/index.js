import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "./index.module.css";
import { getNotionDatabases } from '../lib/notion'

export default function Home({ posts }) {
	return (
		<div className={styles.container}>
			<Head>
				<title>Daily Note</title>
				<meta name="description" content="MA의 시시콜콜한 일상" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<header className={styles.header}>
          <div className={styles.title}>
            <h1>시시콜콜</h1>
            <div className={styles.about}>
              <a href="https://github.com/rmaomina/web-ppomo-react">Github</a>
            </div>
          </div>
          <p className={styles.description}>시시콜콜한 일상 이야기를 기록합니다.</p>
        </header>

				<div className={styles.grid}>
					{posts.map((post) => (
						<div key={post.id} className={styles.card}>
              <h2>
                {post.icon.emoji ? <span className={styles.emoji}>{post.icon.emoji}</span> : ""}
                {post.properties.Title.title[0].plain_text}
              </h2>
              <div className={styles.desc}>
                <p className={styles.created}>{post.created_time.split("T")[0]}</p>
                <Link href={`/${post.id}`}>
                  <a> 더보기 →</a>
                </Link>
              </div>
						</div>
					))}
				</div>
			</main>

			<footer className={styles.footer}>
				<a href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
					Powered by{" "}
					<span className={styles.logo}>
						<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
					</span>
				</a>
			</footer>
		</div>
	);
}

export async function getStaticProps() {
	const database = await getNotionDatabases()

	return {
		props: {
			posts: database,
		},
		revalidate: 1,
	};
}


