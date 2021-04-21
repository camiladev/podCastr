import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image'
import {useRouter} from 'next/router'
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss'
import Link from 'next/link';

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    publishedAt: string;
    duration: number;
    durationString: string;
    description: string;
    url: string;
  
  }
  
  type EpisodeProps = {
    episode: Episode;
  }


export default function Episode({ episode }:EpisodeProps){
    const router = useRouter();

    return(
        <div className={styles.episode}>
          <div className={styles.thumbnailContainer}>
            <Link href='/'>
              <button type='button'>
                  <img src="/arrow-left.svg" alt="Voltar"/>
              </button>

            </Link>
            <Image
                  width={780}
                  height={160}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
            />
            <button type='button'>
                <img src="/play.svg" alt="Tocar episódio"/>
            </button>
          </div>

          <header>
            <h1>{episode.title}</h1>
            <span>{episode.members}</span>
            <span>{episode.publishedAt}</span>
            <span>{episode.durationString}</span>
          </header>

          <div 
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: episode.description}}
            //Mas não deve ser usado se você não souber de onde vem os dados,
            //no nosso caso os dados estão estáticos.
          />
          
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return{
        paths: [],
        fallback: 'blocking'
    }
}


export const getStaticProps:GetStaticProps = async (ctx) => {
    const {slug} = ctx.params
    const { data } = await api.get(`/episodes/${slug}`)
  
    const episodes = data.map(episode => {
      return{
        id: episode.id,
        title: episode.title,
        thumbnail: episode.thumbnail,
        members: episode.members,
        publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(episode.file.duration),
        durationString: convertDurationToTimeString(Number(episode.file.duration)),
        description: episode.description,
        url: episode.file.url,
      }
    })
 
    return{
      props:{
        episodes,
      },
      revalidate: 60 * 60 * 24, //24 horas
    }
  }