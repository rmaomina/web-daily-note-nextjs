import Head from "next/head";
import styles from "./post.module.css"
import { getNotionDatabases, getNotionBlocks, getNotionPage } from "../lib/notion";

export const Text = ({id, text}) => {
  if (!text) return null

  return text.map(value => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value

    return (
      <span key={id} 
        className={[
          bold ? styles.bold: "",
          code ? styles.code : "",
          italic ? styles.italic : "",
          strikethrough ? styles.strikethrough : "",
          underline ? styles.underline : "",
        ].join(" ")}
        style={color !== "default" ? {color} : {}}
      >
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
    )
  })
}

export default function Post({page, blocks}) {
  if (!page || !blocks) return <div />
  console.log(blocks)
  return (
    <div>
      <Head>
        <title>{page.properties.Title.title[0].plain_text}</title>
        <meta name="description" content="MA의 시시콜콜한 일상" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
      <article className={styles.article}>
        <h1 className={styles.title}>
          <Text id={page.id} text={page.properties.Title.title} />
        </h1>
      </article>
    </div>
  )
}

export const getStaticPaths = async () => {
  const database = await getNotionDatabases();
  return {
    paths: database.map((page) => ({ params: { id: page.id } })),
    fallback: true,
  };
};

export const getStaticProps = async (ctx) => {
  const {id} = ctx.params
  const page = await getNotionPage(id)
  const blocks = await getNotionBlocks(id)

  const childBlocks = await Promise.all(
    blocks.filter(block => block.has_children)
    .map(async (block) => {
      return {
        id: block.id,
        children: await getNotionBlocks(block.id)
      }
    })
  )

  const blocksWithChildren = blocks.map(block => {
    if (block.has_children && !block[block.type].children) {
      block[block.type]["children"] = childBlocks.find(x => x.id === block.id)?.children
    }
    return block
  })

  return {
    props: {
      page,
      blocks: blocksWithChildren,
    },
    revalidate: 1,
  }
}