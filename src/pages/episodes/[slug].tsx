import { GetStaticPaths, GetStaticProps } from 'next';
import {useRouter} from 'next/router'
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';


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
        <div className={}></div>
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