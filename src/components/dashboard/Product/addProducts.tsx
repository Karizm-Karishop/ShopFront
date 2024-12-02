import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Formik,
  Field,
  ErrorMessage,
  Form,
  useFormikContext,
  FormikHelpers,
} from "formik";
import * as Yup from "yup";
import BeatLoader from "react-spinners/BeatLoader";
import axios from "axios";
import Check from "../../../assets/Check.png";
import { createProduct } from "../../../Redux/Slices/addProductSlice";
import { uploadSingleImage, uploadGalleryImages } from "../../../utilis/cloud";
import { showErrorToast } from "../../../utilis/ToastProps";
import { useDispatch ,useSelector} from "react-redux";
import {  AppDispatch } from "../../../Redux/store";
import { RootState } from "../../../Redux/store";

interface FormValues {
  name: string;
  shortDesc: string;
  longDesc: string;
  regular_price: number;
  sales_price: number;
  quantity: number;
  category_id: number;
  shop_id: number;
  product_image: string | null;
  gallery: string[];
  tags: string[];
  isAvailable: boolean;
  artist_id?: number; 
}

interface Icategory {
  category_id: number;
  category_name: string;
}

interface Ishop {
  shop_id: number;
  shop_name: string;
}
interface MediaSectionProps {
  localImage: string | null;
  setLocalImage: React.Dispatch<React.SetStateAction<string | null>>;
  localGallery: string[];
  setLocalGallery: React.Dispatch<React.SetStateAction<string[]>>;
}

const MediaSection: React.FC<MediaSectionProps> = ({
  localImage,
  setLocalImage,
  localGallery,
  setLocalGallery,
}) => {
  const { setFieldValue } = useFormikContext<FormValues>();

  useEffect(() => {
    setFieldValue("product_image", localImage);
  }, [localImage, setFieldValue]);

  useEffect(() => {
    setFieldValue("gallery", localGallery);
  }, [localGallery, setFieldValue]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = await uploadSingleImage(e.target.files[0]);
      setLocalImage(imageUrl);
    }
  };

  const handleGalleryImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = await uploadGalleryImages(Array.from(e.target.files));
      setLocalGallery((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setLocalGallery((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      setFieldValue("gallery", updatedImages);
      return updatedImages;
    });
  };

  return (
    <div className="p-5 mt-5">
      <div className="flex flex-row w-full items-center gap-3 pb-4">
        <p className="text-[#323743] text-[18px] font-bold">Media</p>
        <img src={Check} alt="CheckImage" />
      </div>
      <label
        htmlFor="imageInput"
        className="text-[#323743] text-[14px] font-bold mb-3"
      >
        Feature Image
      </label>

      {localImage ? (
        <div>
          <div className="w-[332px] h-[187px] mb-5 p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-md flex items-center justify-center">
            <img
              src={localImage}
              alt="Feature"
              className="object-cover bg-white w-full h-full"
            />
          </div>
          <div className="flex flex-row relative top-[-55px] w-[332px] items-center justify-end pr-2 rounded-br-lg rounded-bl-lg pb-1 pt-1 shadow-sm bg-black bg-opacity-50">
            <button
              type="button"
              onClick={() => setLocalImage(null)}
              className="text-[11px] text-white font-bold z-20 opacity-100"
            >
              Remove
            </button>
            <label htmlFor="imageInput">
              <input
                id="imageInput"
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={() => document.getElementById("imageInput")?.click()}
                className="border border-slate-50 text-[11px] ml-5 p-1 z-20 rounded-md font-bold outline-none text-white"
              >
                Change Image
              </button>
            </label>
          </div>
        </div>
      ) : (
        <div className="flex border border-dashed border-slate-400 text-center w-[125px] h-[125px] cursor-pointer justify-center items-center">
          <label
            htmlFor="imageInput"
            className="text-center w-full cursor-pointer"
          >
            <input
              id="imageInput"
              type="file"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <span className="text-[30px] text-[#9095A1]">+</span>
          </label>
        </div>
      )}
      <ErrorMessage name="product_image" component="div" className="text-red" />

      <p className="text-white font-bold mt-4 mb-3">
        <label
          htmlFor="galleryImageInput"
          className="text-[#323743] text-[14px] font-bold"
        >
          Gallery
        </label>
        <span className="text-[#323743] text-[12px] ml-3 font-normal">
          ({localGallery.length}/4 images)
        </span>
      </p>
      <div className="flex flex-wrap gap-2">
        {localGallery.map((image, index) => (
          <div
            key={`galleryImage-${index}`}
            className="relative w-[125px] h-[125px] flex justify-center items-center"
          >
            <img
              src={image}
              alt={`Gallery ${index}`}
              className="object-contain bg-white w-full h-full"
            />
            <button
              type="button"
              onClick={() => removeGalleryImage(index)}
              className="absolute top-[-10px] right-0 text-[#565D6D] rounded-full p-1"
            >
              x
            </button>
          </div>
        ))}
        {localGallery.length < 4 && (
          <div className="flex border border-dashed border-slate-400 text-center w-[125px] h-[125px] cursor-pointer justify-center items-center">
            <label
              htmlFor="galleryImageInput"
              className="text-center w-full cursor-pointer"
            >
              <input
                id="galleryImageInput"
                type="file"
                multiple
                onChange={handleGalleryImageChange}
                style={{ display: "none" }}
              />
              <span className="text-[30px] text-[#9095A1]">+</span>
            </label>
          </div>
        )}
      </div>
      <ErrorMessage name="gallery" component="div" className="text-red" />
    </div>
  );
};

const validationSchema = Yup.object({
  name: Yup.string().required("Product Name is required"),
  shortDesc: Yup.string().required("Short Description is required"),
  longDesc: Yup.string().required("Long Description is required"),
  regular_price: Yup.number().required("Regular Price is required"),
  sales_price: Yup.number().required("Sales Price is required"),
  quantity: Yup.number().required("Quantity is required"),
  product_image: Yup.string().required("Feature Image is required"),
  gallery: Yup.array().min(1, "At least one gallery image is required"),
  shop_id: Yup.number()
    .moreThan(0, "Please select a valid shop")
    .required("Shop is required"),
  category_id: Yup.number()
    .moreThan(0, "Please select a valid category")
    .required("Category is required"),
});

const AddProducts: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [category, setCategory] = useState<Icategory[]>([]);
  const [shops, setShops] = useState<Ishop[]>([]);
  const user = useSelector((state: RootState) => state.loginIn);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [localGallery, setLocalGallery] = useState<string[]>([]);
  const dispatch: AppDispatch = useDispatch();

  
  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
    } else {
      showErrorToast("Tag does not be empty");
    }
  };
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };


  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/categories/`)
      .then((response) => {
        const categorysData = response.data?.data?.categories || [];
        console.log("Category Data", categorysData);
        setCategory(categorysData);
      })
      .catch((err) => {
        console.error("Error fetching Categories:", err);
        setCategory([]);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/shops/`)
      .then((response) => {
        const shopsData = response.data?.data?.shops || [];
        console.log("Shop Data", shopsData);
        setShops(shopsData);
      })
      .catch((err) => {
        console.error("Error fetching Shops:", err);
        setShops([]);
      });
  }, []);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    const updatedValues = {
      ...values,
      shop_id: Number(values.shop_id),
      category_id: Number(values.category_id),
      tags,
      artist_id: user?.user_id, 
    };

    await dispatch(createProduct(updatedValues)).unwrap();

    setSubmitting(false);
    resetForm();
    setTags([]);
    setLocalImage(null);
    setLocalGallery([]);
  };

  const initialValues: FormValues = {
    name: "",
    shortDesc: "",
    longDesc: "",
    regular_price: 0,
    sales_price: 0,
    quantity: 0,
    shop_id: 0,
    category_id: 0,
    product_image: "",
    gallery: [],
    tags: [],
    isAvailable: true,
    artist_id: user?.user_id,
  };
  return (
    <Formik
      initialValues={{ ...initialValues, tags }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <p className="text-[#6B7280] text-[22px] px-20">Create new product</p>

          <div className="w-full  p-20 flex flex-col justify-between gap-10 md:flex-row lg:flex-row">
            <div className=" p-2 flex flex-1 flex-row bg-white">
              <div className=" p-2 flex-1 flex-col">
                {/* section one */}
                <div className=" p-3">
                  <div className="flex flex-row w-full  items-center gap-3 pb-3">
                    <p className="text-[#323743] text-[18px] font-bold">
                      General Information
                    </p>
                    <img src={Check} alt="CheckImage" />
                  </div>
                  <div className="flex flex-col gap-5 lg:flx-row md:flex-row "></div>
                  <div className="flex flex-col p-1 mb-3">
                    <label
                      htmlFor="Product Names"
                      className="text-[#424856] text-[14px] font-bold"
                    >
                      Product Names is required
                    </label>
                    <Field
                      name="name"
                      as="input"
                      id="name"
                      placeholder="Casual Button-Down Shirt"
                      type="input"
                      text="text"
                      className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px]  group-hover:border-grayDark px-5 py-3"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red"
                    />
                  </div>
                  <div className="flex flex-col gap-5 lg:flx-row md:flex-row ">
                    <div className="flex flex-col w-full p-1 mb-3 lg:w-1/2 md:w-1/2">
                      <label
                        htmlFor="ProductShop2"
                        className="text-[#424856] text-[14px] font-bold mb-2"
                      >
                        Shop Name
                      </label>
                      <Field
                        as="select"
                        id="shop_id"
                        name="shop_id"
                        title="shop"
                      >
                        <option value="0" disabled>
                          Select Shop Name
                        </option>
                        {shops.map((item: Ishop) => (
                          <option key={item.shop_id} value={item.shop_id}>
                            {item.shop_name}
                          </option>
                        ))}
                      </Field>

                      <ErrorMessage
                        name="shop_id"
                        component="div"
                        className="text-red"
                      />
                    </div>

                    <div className="flex flex-col w-full p-1 mb-3 lg:w-1/2 md:w-1/2">
                      <label
                        htmlFor="ProductCategory2"
                        className="text-[#424856] text-[14px] font-bold mb-2"
                      >
                        Category
                      </label>
                      <Field
                        as="select"
                        id="category_id"
                        name="category_id"
                        title="category"
                      >
                        <option value="0" disabled>
                          Select Category
                        </option>
                        {category.map((item: Icategory) => (
                          <option
                            key={item.category_id}
                            value={item.category_id}
                          >
                            {item.category_name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="category_id"
                        component="div"
                        className="text-red"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col p-1 mb-3">
                    <label
                      htmlFor="shortDesc"
                      className="text-[#424856] text-[14px] font-bold"
                    >
                      Short Description
                    </label>
                    <Field
                      name="shortDesc"
                      as="textarea"
                      id="shortDesc"
                      placeholder="Short Description"
                      className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px]  group-hover:border-grayDark px-5 py-3"
                      rows={3}
                    />
                    <ErrorMessage
                      name="shortDesc"
                      component="div"
                      className="text-red"
                    />
                  </div>

                  <div className="flex flex-col p-1 mb-3">
                    <label
                      htmlFor="longDesc"
                      className="text-[#424856] text-[14px] font-bold"
                    >
                      Long Description
                    </label>
                    <Field
                      name="longDesc"
                      as="textarea"
                      id="longDesc"
                      placeholder="Enter a long description"
                      className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px]  group-hover:border-grayDark px-5 py-3"
                      rows={8}
                    />
                    <ErrorMessage
                      name="longDesc"
                      component="div"
                      className="text-red"
                    />
                  </div>
                </div>

                {/* section two */}
                <MediaSection
                  localImage={localImage}
                  setLocalImage={setLocalImage}
                  localGallery={localGallery}
                  setLocalGallery={setLocalGallery}
                />

                <div className="p-3 mt-5">
                  <div className="flex flex-row w-full  items-center gap-3 pb-3">
                    <p className="text-[#323743] text-[18px] font-bold">
                      Organization
                    </p>
                    <img src={Check} alt="CheckImage" />
                  </div>
                  <div className="flex flex-col gap-5 lg:flx-row md:flex-row ">
                    <div className="flex flex-col w-full p-1 mb-3 lg:w-1/2 md:w-1/2">
                      <label
                        htmlFor="regular_price"
                        className="text-[#424856] text-[14px] font-bold"
                      >
                        Regular Price
                      </label>
                      <Field
                        name="regular_price"
                        as="input"
                        id="regular_price"
                        placeholder="99"
                        type="input"
                        text="text"
                        className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px]  group-hover:border-grayDark px-5 py-3"
                      />
                      <ErrorMessage
                        name="regular_price"
                        component="div"
                        className="text-red"
                      />
                    </div>
                    <div className="flex flex-col w-full p-1 mb-3 lg:w-1/2 md:w-1/2">
                      <label
                        htmlFor="sales_price"
                        className="text-[#424856] text-[14px] font-bold"
                      >
                        Sales Price
                      </label>
                      <Field
                        name="sales_price"
                        as="input"
                        id="sales_price"
                        placeholder="79"
                        type="input"
                        text="text"
                        className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px]  group-hover:border-grayDark px-5 py-3"
                      />
                      <ErrorMessage
                        name="sales_price"
                        component="div"
                        className="text-red"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 lg:flx-row md:flex-row ">
                    <div className="flex flex-col w-full p-1 mb-3 lg:w-1/2 md:w-1/2">
                      <label
                        htmlFor="quantity"
                        className="text-[#424856] text-[14px] font-bold"
                      >
                        quantity
                      </label>
                      <Field
                        name="quantity"
                        as="input"
                        id="quantity"
                        placeholder="1"
                        type="input"
                        text="text"
                        className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px]  group-hover:border-grayDark px-5 py-3"
                      />
                      <ErrorMessage
                        name="quantity"
                        component="div"
                        className="text-red"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full p-8 pt-0 lg:w-[30%] md:w-[30%] lg:p-0 md:p-0">
              <div className="flex flex-col p-1 mb-3 w-[100%] justify-center">
                <label
                  htmlFor="Tags"
                  className="text-[#171A1F] text-[14px] font-bold items-start  justify-start flex"
                >
                  Tags
                </label>
                <div className="flex flex-row gap-2 flex-wrap pl-5 pr-5 mb-5 mt-5">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-white flex flex-row items-center text-center bg-[#6D31ED] gap-3 pr-4 pl-4 rounded-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-white text-[15px]"
                      >
                        X
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-col w-[100%] lg:w-[80%] md:w-[80%] ">
                  <Field
                    type="text"
                    id="Tags"
                    placeholder="Enter a tag"
                    className="h-full w-[100%] bg-transparent py-3 o p-2 outline-none rounded-md"
                    value={newTag}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNewTag(e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="text-[#6D31ED] text-[14px] outline-none flex justify-start mt-5 mb-5"
                  >
                    + Add another Tag
                  </button>
                </div>
              </div>
              <div>
                <div className="flex flex-col  p-1 mt-4 justify-center ">
                  <button
                    type="submit"
                    className="bg-[#1C4A93] w-[100%] text-white px-6 py-3 rounded-md flex justify-center items-center gap-2 text-sm hover:text-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out lg:w-[80%] md:w-[80%] outline"
                  >
                    {isSubmitting ? (
                      <BeatLoader color="#ffffff" size={8} />
                    ) : (
                      "Save Product"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddProducts;
