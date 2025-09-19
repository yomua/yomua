

# 概述

一个新的架构, React 16+ 才有.

通过 linked list, 记下本次渲染的节点, 从而实现可以打断 React 渲染流程, 并在浏览器有空闲时继续再上次被打断的地方进行渲染.

使得在感官上, React 项目运行的更为流畅, 不阻塞浏览器渲染.

# Reference

- [React Filter 原理](https://medium.com/starbugs/react-%E9%96%8B%E7%99%BC%E8%80%85%E4%B8%80%E5%AE%9A%E8%A6%81%E7%9F%A5%E9%81%93%E7%9A%84%E5%BA%95%E5%B1%A4%E6%9E%B6%E6%A7%8B-react-fiber-c3ccd3b047a1) 



