import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/post.entity';

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  async getAllPosts(): Promise<PostsModel[]> {
    return this.postsRepository.find();
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('Could not find post');
    }

    return post;
  }

  /*
   *  1. create -> 저장할 객체를 생성
   *  2. save -> 저장
   * */
  async createPost(author: string, title: string, content: string) {
    const post = this.postsRepository.create({
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    });

    return await this.postsRepository.save(post);
  }

  /*
   * save의 기능
   * 1. 데이터가 존재하지 않으면 (id 기준으로) 새로 생성
   * 2. 데이터가 존재하면 (같은 id 값이 존재) 존재하던 값을 업데이트
   * */
  async updatePost(
    postId: number,
    author?: string,
    title?: string,
    content?: string,
  ) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Could not find post');
    }

    if (author) {
      post.author = author;
    }
    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }

    return await this.postsRepository.save(post);
  }

  async deletePost(postId: number) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Could not find post');
    }

    await this.postsRepository.delete(postId);

    return postId;
  }
}
