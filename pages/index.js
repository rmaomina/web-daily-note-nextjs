import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Client } from '@notionhq/client'

export default function Home({ notes }) {
	return (
		<div className={styles.container}>
			<Head>
				<title>Daily Note</title>
				<meta name='description' content='Daily Note App by MA' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className={styles.main}>
				<div className={styles.title}>
					<h1>하루</h1>
					<div className={styles.about}>
						<a href='https://github.com/rmaomina/web-ppomo-react'>Github</a>
					</div>
				</div>

				<p className={styles.description}>일상을 기록합니다.</p>
				<div className={styles.grid}>
					{notes.map((daily) => {
            <div key={daily.id} className={styles.card}>
              <div className="card-header">
                <h2>Title 여기에 타이틀이 들어간다 
                  {daily.icon.emoji?<span>{daily.icon.emoji}</span> : ""}
                  {daily.properties.note.title[0].plain_text}
                </h2>
                <p className={styles.created}>{daily.created_time.split('T')[0]}</p>
              </div>
              <div className="card-body">
                여기에 일기가 추가됩니다. 
              </div>
            </div>
          })}
				</div>
			</main>

			<footer className={styles.footer}>
				<a href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app' target='_blank' rel='noopener noreferrer'>
					Powered by{' '}
					<span className={styles.logo}>
						<Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
					</span>
				</a>
			</footer>
		</div>
	)
}

export async function getStaticProps() {
	const notion = new Client({ auth: process.env.NOTION_API_KEY })
	const response = await notion.databases.query({
		database_id: process.env.NOTION_DATABASE_ID,
	})
	return {
		props: {
			notes: response.results,
		},
	}
}
